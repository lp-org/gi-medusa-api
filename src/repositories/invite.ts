import { dataSource } from "@medusajs/medusa/dist/loaders/database";
import {
  // alias the core repository to not cause a naming conflict
  InviteRepository as MedusaInviteRepository,
} from "@medusajs/medusa/dist/repositories/invite";
import { Invite } from "../models/Invite";

export const InviteRepository = dataSource.getRepository(Invite).extend({
  // it is important to spread the existing repository here.
  // Otherwise you will end up losing core properties.
  // you also update the target to the extended entity
  ...Object.assign(MedusaInviteRepository, { target: Invite }),

  // you can add other customizations as well...
});

export default InviteRepository;
