import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class ExtendStoreContentSetting21697082594241
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "store_content",
      new TableColumn({
        name: "tiktok",
        type: "varchar",
        isNullable: true,
      })
    );

    await queryRunner.addColumn(
      "store_content",
      new TableColumn({
        name: "shopee",
        type: "varchar",
        isNullable: true,
      })
    );

    await queryRunner.addColumn(
      "store_content",
      new TableColumn({
        name: "whatapps",
        type: "varchar",
        isNullable: true,
      })
    );

    await queryRunner.addColumn(
      "store_content",
      new TableColumn({
        name: "website",
        type: "varchar",
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("store_content", "tiktok");
    await queryRunner.dropColumn("store_content", "shopee");
    await queryRunner.dropColumn("store_content", "whatapps");
    await queryRunner.dropColumn("store_content", "website");
  }
}
