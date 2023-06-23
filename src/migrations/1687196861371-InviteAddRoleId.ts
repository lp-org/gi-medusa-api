import {
  MigrationInterface,
  QueryRunner,
  TableColumn,
  TableForeignKey,
} from "typeorm";

export class InviteAddRoleId1687196861371 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "invite",
      new TableColumn({
        name: "role_id",
        type: "varchar",
      })
    );
    await queryRunner.createForeignKey(
      "invite",
      new TableForeignKey({
        columnNames: ["role_id"],
        referencedTableName: "role",
        referencedColumnNames: ["id"],
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey("invite", "role_id");
    await queryRunner.dropColumn("invite", "role_id");
  }
}
