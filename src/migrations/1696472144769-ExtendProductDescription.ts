import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class ExtendProductDescription1696472144769
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "product",
      new TableColumn({
        name: "description_2",
        type: "varchar",
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("product", "description_2");
  }
}
