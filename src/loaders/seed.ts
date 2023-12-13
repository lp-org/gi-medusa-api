import {
  FulfillmentProviderService,
  PaymentProviderService,
  ProductService,
  RegionService,
} from "@medusajs/medusa";
import { AwilixContainer } from "awilix";
import PermissionRepository from "./../repositories/permission";
import { EntityManager } from "typeorm";

import { permissionList } from "../utils/permissions";
import UserRepository from "../repositories/user";
import { setMetadata } from "@medusajs/utils";
import PageCustomizeKeyRepository from "../repositories/pageCustomizeKey";
import WeightFulfillmentRepository from "../repositories/weightFulfillment";

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

  // const users = await userRepo.find({ order: { created_at: "asc" } });
  // if (users) {
  //   const superadmin = users[0];
  //   if (superadmin) {
  //     superadmin.metadata = setMetadata(superadmin, { superadmin: true });
  //     await userRepo.save(superadmin);
  //   }
  // }

  // PageCustomizeKey

  const pageCustomizeKeyData = [
    "custom_terms",
    "custom_privacy_policy",
    "custom_refund_policy",
    "custom_delivery_policy",
  ];
  const customizeKey = await PageCustomizeKeyRepository.find();

  if (!customizeKey.length) {
    const data = PageCustomizeKeyRepository.create(
      pageCustomizeKeyData.map((el) => ({ key: el }))
    );
    await PageCustomizeKeyRepository.save(data);
  }
  const fulfilmentProviderService: FulfillmentProviderService =
    container.resolve("fulfillmentProviderService");
  await fulfilmentProviderService.registerInstalledProviders(["weight"]);
  const regionService: RegionService = container.resolve("regionService");
  const allRegions = await regionService.list();
  allRegions.forEach(async (el) => {
    await regionService.addFulfillmentProvider(el.id, "weight");
  });

  // Weight fulfillment
  const weightFulfillmentExist = await WeightFulfillmentRepository.exist();
  if (!weightFulfillmentExist) {
    const weightFulfillmentData = WeightFulfillmentRepository.create({
      id: "weight-fulfillment",
      name: "Weight fulfillment (Default)",
      initial_price: 700,
      initial_weight: 2000,
      additional_price: 100,
      every_additional_weight: 1000,
    });
    await WeightFulfillmentRepository.save(weightFulfillmentData);
  }

  const paymentProviderService: PaymentProviderService = container.resolve(
    "paymentProviderService"
  );
  await paymentProviderService.registerInstalledProviders(["ipay88"]);
  // allRegions.forEach(async (el) => {
  //   await regionService.addPaymentProvider(el.id, "ipay88");
  // });

  console.info("Ending loader...");
};
