import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreatePages1688450586641 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "page",
        columns: [
          { name: "id", type: "varchar", isPrimary: true },
          { name: "title", type: "varchar" },
          { name: "handle", type: "varchar", isNullable: true },
          { name: "description", type: "varchar", isNullable: true },
          { name: "body", type: "varchar", isNullable: true },
          { name: "publish", type: "boolean", default: true },
          { name: "created_at", type: "timestamp", default: "now()" },
          { name: "updated_at", type: "timestamp", default: "now()" },
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("page");
  }
}
