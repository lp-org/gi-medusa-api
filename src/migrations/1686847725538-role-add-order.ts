import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class PermissionAddOrder1686847725538 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "permission",
      new TableColumn({
        name: "order",
        type: "serial",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("permission", "order");
  }
}
