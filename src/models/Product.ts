import { Column, Entity } from "typeorm";
import {
  // alias the core entity to not cause a naming conflict
  Product as MedusaProduct,
} from "@medusajs/medusa";

@Entity()
export class Product extends MedusaProduct {
  @Column()
  description_2: string;
}
