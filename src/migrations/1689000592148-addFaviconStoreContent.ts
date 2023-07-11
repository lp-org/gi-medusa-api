import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddFaviconStoreContent1689000592148 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "store_content",
      new TableColumn({
        name: "favicon",
        type: "varchar",
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("permission", "favicon");
  }
}
