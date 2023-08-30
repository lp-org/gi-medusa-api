import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class PagesAddCustomize1693318821749 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "page",
      new TableColumn({
        name: "customize",
        type: "boolean",
        default: false,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("page", "customize");
  }
}
