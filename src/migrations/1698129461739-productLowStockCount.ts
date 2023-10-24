import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from "typeorm";

export class ProductLowStockCount1698129461739 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "product_low_stock_count",
        columns: [
          { name: "id", type: "varchar", isPrimary: true },
          { name: "product_id", type: "varchar" },
          { name: "product_variant_id", type: "varchar" },
          { name: "inventory_quantity", type: "integer" },
          { name: "created_at", type: "timestamp", default: "now()" },
          { name: "updated_at", type: "timestamp", default: "now()" },
        ],
      }),
      true
    );

    await queryRunner.createForeignKey(
      "product_low_stock_count",
      new TableForeignKey({
        columnNames: ["product_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "product",
        onDelete: "CASCADE",
      })
    );

    await queryRunner.createForeignKey(
      "product_low_stock_count",
      new TableForeignKey({
        columnNames: ["product_variant_id"],
        referencedColumnNames: ["id"],
        referencedTableName: "product_variant",
        onDelete: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("product_low_stock_count");
  }
}
