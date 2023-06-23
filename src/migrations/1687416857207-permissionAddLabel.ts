import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class PermissionAddLabel1687416857207 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "permission",
      new TableColumn({
        name: "label",
        type: "varchar",
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("permission", "label");
  }
}
