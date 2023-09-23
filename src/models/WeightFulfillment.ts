import { BeforeInsert, Column, Entity } from "typeorm";

@Entity()
export class WeightFulfillment {
  @Column({ type: "varchar", primary: true })
  id: string;

  @Column({ type: "varchar" })
  name: string;

  @Column({ type: "integer" })
  initial_price: number;

  @Column({ type: "integer" })
  initial_weight: number;

  @Column({ type: "integer" })
  additional_price: number;

  @Column({ type: "integer" })
  every_additional_weight: number;
}
