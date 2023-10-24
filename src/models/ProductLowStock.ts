import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
} from "typeorm";

import { BaseEntity } from "@medusajs/medusa";

import { generateEntityId } from "@medusajs/medusa/dist/utils";
import { Product } from "./Product";
import { ProductVariant } from "./ProductVariant";

@Entity()
export class ProductLowStockCount extends BaseEntity {
  @Index()
  @Column({ nullable: true })
  product_id: string;

  @Index()
  @Column({ nullable: true })
  product_variant_id: string;

  @Column()
  inventory_quantity: number;

  @ManyToOne(() => Product, (product) => product.lowStockCount)
  @JoinColumn({ name: "product_id" })
  product: Product;

  @ManyToOne(
    () => ProductVariant,
    (productVariant) => productVariant.lowStockCount
  )
  @JoinColumn({ name: "product_variant_id" })
  product_variant: ProductVariant;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "pdl");
  }
}
