import { dataSource } from "@medusajs/medusa/dist/loaders/database";
import {
  // alias the core repository to not cause a naming conflict
  UserRepository as MedusaUserRepository,
} from "@medusajs/medusa/dist/repositories/user";
import { User } from "../models/User";

export const UserRepository = dataSource.getRepository(User).extend({
  // it is important to spread the existing repository here.
  // Otherwise you will end up losing core properties.
  // you also update the target to the extended entity
  ...Object.assign(MedusaUserRepository, { target: User }),

  // you can add other customizations as well...
});

export default UserRepository;
