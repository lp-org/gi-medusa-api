import { Lifetime } from "awilix";
import MedusaUserService from "@medusajs/medusa/dist/services/user";
import { FindConfig, User, buildQuery } from "@medusajs/medusa";
import { UpdateUserInput } from "@medusajs/medusa/dist/types/user";
import { isDefined, setMetadata } from "@medusajs/utils";
import { MedusaError } from "medusa-core-utils";
import { EntityManager } from "typeorm";
import { Permission } from "../models/Permission";
// 7 days

export interface UpdateUserWithRoleIdInput
  extends Omit<UpdateUserInput, "role"> {
  role_id: string;
}

class UserService extends MedusaUserService {
  // The default life time for a core service is SINGLETON
  static LIFE_TIME = Lifetime.SCOPED;

  /**
   * Updates a user.
   * @param {object} userId - id of the user to update
   * @param {object} update - the values to be updated on the user
   * @return {Promise} the result of create
   */
  async updateWithRoleId(
    userId: string,
    update: UpdateUserWithRoleIdInput
  ): Promise<User> {
    return await this.atomicPhase_(async (manager: EntityManager) => {
      const userRepo = manager.withRepository(this.userRepository_);

      const user = await this.retrieve(userId);

      const { email, password_hash, metadata, ...rest } = update;

      if (email) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "You are not allowed to update email"
        );
      }

      if (password_hash) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Use dedicated methods, `setPassword`, `generateResetPasswordToken` for password operations"
        );
      }

      if (metadata) {
        user.metadata = setMetadata(user, metadata);
      }

      for (const [key, value] of Object.entries(rest)) {
        user[key] = value;
      }

      const updatedUser = await userRepo.save(user);

      await this.eventBus_
        .withTransaction(manager)
        .emit(UserService.Events.UPDATED, { id: updatedUser.id });

      return updatedUser;
    });
  }

  async retrieveUserPermission(userId: string): Promise<Permission[]> {
    return await this.atomicPhase_(async (manager: EntityManager) => {
      const user: User = await this.retrieve(userId, {
        relations: ["teamRole.permissions"],
      });
      return user.teamRole ? user.teamRole.permissions : [];
    });
  }
}

export default UserService;
