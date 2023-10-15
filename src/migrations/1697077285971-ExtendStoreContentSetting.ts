import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class ExtendStoreContentSetting1697077285971
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "store_content",
      new TableColumn({
        name: "wording_1",
        type: "varchar",
        isNullable: true,
      })
    );

    await queryRunner.addColumn(
      "store_content",
      new TableColumn({
        name: "wording_2",
        type: "varchar",
        isNullable: true,
      })
    );

    await queryRunner.addColumn(
      "store_content",
      new TableColumn({
        name: "banner_1",
        type: "varchar",
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("store_content", "wording_1");
    await queryRunner.dropColumn("store_content", "wording_2");
    await queryRunner.dropColumn("store_content", "banner_1");
  }
}
