import { BeforeInsert, Column, Entity, JoinTable, ManyToMany } from "typeorm";

import { BaseEntity } from "@medusajs/medusa";
import { DbAwareColumn } from "@medusajs/medusa/dist/utils/db-aware-column";

import { generateEntityId } from "@medusajs/medusa/dist/utils";
import { Role } from "./Role";

@Entity()
export class Permission extends BaseEntity {
  @Column({ type: "varchar" })
  name: string;

  @Column({ type: "int" })
  order: number;

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown>;

  @ManyToMany(() => Role, (role) => role.permissions)
  @JoinTable({
    name: "role_permissions_permission",
    joinColumn: {
      name: "role_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "permission_id",
      referencedColumnName: "id",
    },
  })
  roles: Role[];

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "perm");
  }
}
