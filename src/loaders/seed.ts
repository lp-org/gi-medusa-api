import { ProductService } from "@medusajs/medusa";
import { AwilixContainer } from "awilix";
import PermissionRepository from "./../repositories/permission";
import { EntityManager } from "typeorm";

import { permissionList } from "../utils/permissions";
import UserRepository from "../repositories/user";
import { setMetadata } from "@medusajs/utils";

export default async (
  container: AwilixContainer,
  config: Record<string, unknown>
): Promise<void> => {
  console.info("Starting seeding loader...");
  const permissionRepository: typeof PermissionRepository = container.resolve(
    "permissionRepository"
  );
  const entityManager = container.resolve<EntityManager>("manager");
  const permissionRepo = entityManager.withRepository(permissionRepository);
  const userRepo = entityManager.withRepository(UserRepository);
  const permissionCount = await permissionRepo.count();

  if (permissionCount !== permissionList.length) {
    console.info("seed permission");

    for (const perm of permissionList) {
      const { name, label } = perm;
      const permission = await permissionRepo.findOne({
        where: { name: perm.name },
      });
      if (permission) {
        permissionRepo.save({ ...permission, name, label });
      } else {
        const data = permissionRepo.create({ name, label });
        await permissionRepo.save(data);
      }
    }
  }

  const users = await userRepo.find({ order: { created_at: "asc" } });
  if (users) {
    const superadmin = users[0];
    if (superadmin) {
      superadmin.metadata = setMetadata(superadmin, { superadmin: true });
      await userRepo.save(superadmin);
    }
  }
  console.info("Ending loader...");
};
