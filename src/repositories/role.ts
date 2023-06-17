import { Role } from "./../models/Role";
import { dataSource } from "@medusajs/medusa/dist/loaders/database";

export const RoleRepository = dataSource.getRepository(Role);
export default RoleRepository;
