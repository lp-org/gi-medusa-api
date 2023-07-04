import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from "typeorm";

import { BaseEntity } from "@medusajs/medusa";

import { generateEntityId } from "@medusajs/medusa/dist/utils";
import { Permission } from "./Permission";
import { User } from "./User";
import { Store } from "./Store";
import { Invite } from "./Invite";

@Entity()
export class Role extends BaseEntity {
  @Column({ type: "varchar" })
  name: string;

  @Index()
  @Column({ nullable: true })
  store_id: string;

  @ManyToMany(() => Permission, (permission) => permission.roles)
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
  permissions: Permission[];

  @OneToMany(() => User, (user) => user.teamRole)
  @JoinColumn({ name: "id", referencedColumnName: "role_id" })
  users: User[];

  @OneToMany(() => Invite, (invite) => invite.teamRole)
  @JoinColumn({ name: "id", referencedColumnName: "role_id" })
  invites: Invite[];

  @ManyToOne(() => Store, (store) => store.roles)
  @JoinColumn({ name: "store_id" })
  store: Store;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "role");
  }
}
