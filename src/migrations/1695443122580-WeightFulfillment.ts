import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class WeightFulfillment1695443122580 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "weight_fulfillment",
        columns: [
          { name: "id", type: "varchar", isPrimary: true },
          { name: "name", type: "varchar" },
          { name: "initial_price", type: "integer" },
          { name: "initial_weight", type: "integer" },
          { name: "additional_price", type: "integer" },
          { name: "every_additional_weight", type: "integer" },
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("weight_fulfillment");
  }
}
