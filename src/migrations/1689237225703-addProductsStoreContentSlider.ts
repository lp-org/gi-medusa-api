import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddProductsStoreContentSlider1689237225703
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "store_content",
      new TableColumn({
        name: "slider_product",
        type: "jsonb",
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("store_content", "slider_product");
  }
}
