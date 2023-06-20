import { Lifetime } from "awilix";
import MedusaUserService from "@medusajs/medusa/dist/services/user";
import { FindConfig, User, buildQuery } from "@medusajs/medusa";
import { UpdateUserInput } from "@medusajs/medusa/dist/types/user";
import { isDefined, setMetadata } from "@medusajs/utils";
import { MedusaError } from "medusa-core-utils";
import { EntityManager } from "typeorm";
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

  /**
   * Gets a user by id.
   * Throws in case of DB Error and if user was not found.
   * @param {string} userId - the id of the user to get.
   * @param {FindConfig} config - query configs
   * @return {Promise<User>} the user document.
   */
  async retrieveWithPermissions(
    userId: string,
    config: FindConfig<User> = {}
  ): Promise<User> {
    if (!isDefined(userId)) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `"userId" must be defined`
      );
    }

    const userRepo = this.activeManager_.withRepository(this.userRepository_);
    const query = buildQuery({ id: userId }, config);

    const user = await userRepo.findOne(query);

    if (!user) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `User with id: ${userId} was not found`
      );
    }

    return user;
  }
}

export default UserService;
