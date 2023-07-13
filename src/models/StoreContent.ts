import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinTable,
  ManyToOne,
  OneToMany,
  OneToOne,
} from "typeorm";
import { Store } from "./Store";
import { BaseEntity, generateEntityId } from "@medusajs/medusa";

@Entity()
export class StoreContent extends BaseEntity {
  @Column({ type: "varchar" })
  store_id: string;

  @Column({ type: "varchar", nullable: true })
  facebook_url: string;

  @Column({ type: "varchar", nullable: true })
  instagram_url: string;

  @Column({ type: "varchar", nullable: true })
  phone_no: string;

  @Column({ type: "varchar", nullable: true })
  email: string;

  @Column({ type: "varchar", nullable: true })
  address: string;

  @Column({ type: "varchar", nullable: true })
  logo: string;

  @Column({ type: "varchar", nullable: true })
  favicon: string;

  @Column({ type: "jsonb", nullable: true })
  slider: SliderType[];

  @Column({ type: "jsonb", nullable: true })
  slider_product: SliderType[];

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "sc");
  }
}

export type SliderType = {
  image: string;
  description?: string;
  is_active: boolean;
  open_new: boolean;
};
