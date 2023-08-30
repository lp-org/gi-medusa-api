import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class PagesCustomizeKey1693319247628 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "page_customize_key",
        columns: [{ name: "key", type: "varchar", isPrimary: true }],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("page_customize_key");
  }
}
