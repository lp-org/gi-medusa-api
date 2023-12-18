import {
  ProductService,
  ProductStatus,
  ScheduledJobArgs,
  ScheduledJobConfig,
} from "@medusajs/medusa";
import { AwilixContainer } from "awilix";
import { In, Not } from "typeorm";
import ProductLowStockRepository from "../repositories/productLowStock";

const INVENTORY_QUANTITY_TRESHOLD = 5;

// const lowStock = async (
//   container: AwilixContainer,
//   options: Record<string, any>
// ) => {
//   const jobSchedulerService = container.resolve("jobSchedulerService");
//   jobSchedulerService.create(
//     "publish-products",
//     {},
//     "0 */12 * * *",
//     async () => {
//       // job to execute
//       const productService: ProductService =
//         container.resolve("productService");
//       const draftProducts = await productService.list(
//         {
//           status: ProductStatus.PUBLISHED,
//         },
//         { relations: ["variants"] }
//       );
//       const variant_ids = [];
//       for (const product of draftProducts) {
//         product.variants?.forEach(async (el) => {
//           if (el.inventory_quantity < INVENTORY_QUANTITY_TRESHOLD) {
//             variant_ids.push(el.id);
//             const prod = await ProductLowStockRepository.findOne({
//               where: { product_id: product.id, product_variant_id: el.id },
//             });
//             if (!prod) {
//               const data = ProductLowStockRepository.create({
//                 product_id: product.id,
//                 product_variant_id: el.id,
//                 inventory_quantity: el.inventory_quantity,
//               });

//               ProductLowStockRepository.save(data);
//             }
//           }
//         });
//       }

//       ProductLowStockRepository.delete({
//         product_variant_id: Not(In(variant_ids)),
//       });
//     }
//   );
// };

// export default lowStock;

export default async function handler({
  container,
  data,
  pluginOptions,
}: ScheduledJobArgs) {
  // job to execute
  const productService: ProductService = container.resolve("productService");
  const draftProducts = await productService.list(
    {
      status: ProductStatus.PUBLISHED,
    },
    { relations: ["variants"] }
  );
  const variant_ids = [];
  console.log("low stock");
  for (const product of draftProducts) {
    product.variants?.forEach(async (el) => {
      if (el.inventory_quantity < INVENTORY_QUANTITY_TRESHOLD) {
        variant_ids.push(el.id);
        const prod = await ProductLowStockRepository.findOne({
          where: { product_id: product.id, product_variant_id: el.id },
        });
        if (!prod) {
          const data = ProductLowStockRepository.create({
            product_id: product.id,
            product_variant_id: el.id,
            inventory_quantity: el.inventory_quantity,
          });
          ProductLowStockRepository.save(data);
        }
      }
    });
  }
  ProductLowStockRepository.delete({
    product_variant_id: Not(In(variant_ids)),
  });
}

export const config: ScheduledJobConfig = {
  name: "publish-twice-a-day",
  schedule: "0 */12 * * *",
  data: {},
};
