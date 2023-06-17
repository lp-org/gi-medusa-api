import { ProductService } from "@medusajs/medusa";
import { AwilixContainer } from "awilix";
import PermissionRepository from "./../repositories/permission";
import { EntityManager } from "typeorm";
import { Permission } from "../models/Permission";

const permissionList = [
  {
    name: "products.view",
  },
  {
    name: "products.add",
  },
  {
    name: "orders.view",
  },
  {
    name: "customers.view",
  },
  {
    name: "discounts.view",
  },
  {
    name: "discounts.add",
  },
  {
    name: "pricings.view",
  },
  {
    name: "pricings.add",
  },
  {
    name: "giftcard.add",
  },
  {
    name: "giftcard.view",
  },
  {
    name: "setting.reigons",
  },
  {
    name: "setting.currencies",
  },
  {
    name: "setting.store-details",
  },
  {
    name: "setting.return-reasons",
  },
  {
    name: "setting.the-team",
  },
  {
    name: "setting.roles",
  },
  {
    name: "setting.personal-information",
  },
  {
    name: "setting.tax",
  },
  {
    name: "setting.sales-channels",
  },
  {
    name: "setting.api-key-management",
  },
];

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
  const permissionCount = await permissionRepo.count();

  if (permissionCount == 0) {
    console.info("seed permission");
    // await permissionRepo
    //   .createQueryBuilder()
    //   .insert()
    //   .into(Permission)
    //   .values([
    //     {
    //       name: "product-view",
    //     },
    //   ])
    //   .execute();
    for (const perm of permissionList) {
      const data = permissionRepo.create(perm);
      await permissionRepo.save(data);
    }
  }
  console.info("Ending loader...");
};
