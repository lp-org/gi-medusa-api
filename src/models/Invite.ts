import { Column, Entity, Index, JoinColumn, ManyToOne } from "typeorm";
import {
  // alias the core entity to not cause a naming conflict
  Invite as MedusaInvite,
} from "@medusajs/medusa";
import { Role } from "./Role";

@Entity()
export class Invite extends MedusaInvite {
  @Index()
  @Column({ nullable: true })
  role_id: string;

  @ManyToOne(() => Role)
  @JoinColumn({ name: "role_id" })
  teamRole: Role;
}
