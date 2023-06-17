import { Permission } from "./../models/Permission";
import { dataSource } from "@medusajs/medusa/dist/loaders/database";

export const PermissionRepository = dataSource.getRepository(Permission);
export default PermissionRepository;
