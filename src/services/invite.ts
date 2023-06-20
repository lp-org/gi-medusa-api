import { Lifetime } from "awilix";
import MedusaInviteService from "@medusajs/medusa/dist/services/invite";
import InviteRepository from "../repositories/invite";
import UserRepository from "../repositories/user";
import { MedusaError } from "@medusajs/utils";
// 7 days
const DEFAULT_VALID_DURATION = 1000 * 60 * 60 * 24 * 7;
class InviteService extends MedusaInviteService {
  // The default life time for a core service is SINGLETON
  static LIFE_TIME = Lifetime.SCOPED;

  async createWithRoleId(
    user: string,
    role_id: string,
    validDuration = DEFAULT_VALID_DURATION
  ) {
    return await this.atomicPhase_(async (manager) => {
      const inviteRepository =
        this.activeManager_.withRepository(InviteRepository);

      const userRepo = this.activeManager_.withRepository(UserRepository);

      const userEntity = await userRepo.findOne({
        where: { email: user },
      });

      if (userEntity) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Can't invite a user with an existing account"
        );
      }

      let invite = await inviteRepository.findOne({
        where: { user_email: user },
      });
      // if user is trying to send another invite for the same account + email, but with a different role
      // then change the role on the invite as long as the invite has not been accepted yet
      if (invite && !invite.accepted && invite.role_id !== role_id) {
        invite.role_id = role_id;

        invite = await inviteRepository.save(invite);
      } else if (!invite) {
        // if no invite is found, create a new one
        const created = inviteRepository.create({
          role_id,
          token: "",
          user_email: user,
        });

        invite = await inviteRepository.save(created);
      }

      invite.token = this.generateToken({
        invite_id: invite.id,
        role_id,
        user_email: user,
      });

      invite.expires_at = new Date();
      invite.expires_at.setMilliseconds(
        invite.expires_at.getMilliseconds() + validDuration
      );

      invite = await inviteRepository.save(invite);

      await this.eventBus_
        .withTransaction(manager)
        .emit(InviteService.Events.CREATED, {
          id: invite.id,
          token: invite.token,
          user_email: invite.user_email,
        });
    });
  }
}

export default InviteService;
