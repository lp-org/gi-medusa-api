import { BeforeInsert, Column, Entity } from "typeorm";
import { BaseEntity, generateEntityId } from "@medusajs/medusa";

@Entity()
export class PageCustomizeKey {
  @Column({ type: "varchar", primary: true })
  key: string;
}
