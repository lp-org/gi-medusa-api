import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class PagesAddRank1693408146335 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "page",
      new TableColumn({
        name: "rank",
        type: "serial",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("rank");
  }
}
