import {
  MigrationInterface,
  QueryRunner,
  TableForeignKey,
  Table,
} from "typeorm";

export class StoreContentManagement1687623903053 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "store_content",
        columns: [
          { name: "id", type: "varchar", isPrimary: true },
          { name: "store_id", type: "varchar" },
          { name: "facebook_url", type: "varchar", isNullable: true },
          { name: "instagram_url", type: "varchar", isNullable: true },
          { name: "phone_no", type: "varchar", isNullable: true },
          { name: "email", type: "varchar", isNullable: true },
          { name: "address", type: "varchar", isNullable: true },
          { name: "logo", type: "varchar", isNullable: true },
          { name: "slider", type: "jsonb", isNullable: true },
          { name: "created_at", type: "timestamp", default: "now()" },
          { name: "updated_at", type: "timestamp", default: "now()" },
        ],
        foreignKeys: [
          {
            columnNames: ["store_id"],
            referencedTableName: "store",
            referencedColumnNames: ["id"],
          },
        ],
      }),
      true
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("store_content");
    // await queryRunner.dropTable("store_sliders");
  }
}
