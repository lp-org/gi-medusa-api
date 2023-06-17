import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import {
  // alias the core entity to not cause a naming conflict
  Store as MedusaStore,
} from "@medusajs/medusa/dist/models/store";
import { Role } from "./Role";

@Entity()
export class Store extends MedusaStore {
  @OneToMany(() => Role, (role) => role.store)
  roles: Role[];
}
