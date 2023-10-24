import { Column, Entity } from "typeorm";
import {
  // alias the core entity to not cause a naming conflict
  ProductVariant as MedusaProductVariant,
} from "@medusajs/medusa";
import { ProductLowStockCount } from "./ProductLowStock";

@Entity()
export class ProductVariant extends MedusaProductVariant {
  lowStockCount: ProductLowStockCount[];
}
