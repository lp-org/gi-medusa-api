import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class ExtendStoreContentSetting31697083866278
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "store_content",
      new TableColumn({
        name: "wording_3",
        type: "varchar",
        isNullable: true,
      })
    );

    await queryRunner.addColumn(
      "store_content",
      new TableColumn({
        name: "banner_2",
        type: "varchar",
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("store_content", "wording_3");
    await queryRunner.dropColumn("store_content", "banner_2");
  }
}
