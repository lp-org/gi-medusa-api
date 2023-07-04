import { BeforeInsert, Column, Entity } from "typeorm";
import { BaseEntity, generateEntityId } from "@medusajs/medusa";

@Entity()
export class Page extends BaseEntity {
  @Column({ type: "varchar", nullable: true })
  title: string;

  @Column({ type: "varchar", nullable: true })
  handle: string;

  @Column({ type: "varchar", nullable: true })
  description: string;

  @Column({ type: "varchar", nullable: true })
  body: string;

  @Column({ type: "boolean" })
  publish: boolean;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "page");
  }
}
