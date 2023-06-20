import { MigrationInterface, QueryRunner } from "typeorm";

export class Role1686809962528 implements MigrationInterface {
  name = "Role1686809962528";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "role" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "store_id" character varying, CONSTRAINT "PK_b36bcfe02fc8de3c57a8b2391c2" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_29259dd58b1052aef9be56941d" ON "role" ("store_id") `
    );
    await queryRunner.query(
      `CREATE TABLE "permission" ("id" character varying NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "name" character varying NOT NULL, "metadata" jsonb, CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY ("id"))`
    );
    await queryRunner.query(
      `CREATE TABLE "role_permissions_permission" ("role_id" character varying NOT NULL, "permission_id" character varying NOT NULL, CONSTRAINT "PK_b817d7eca3b85f22130861259dd" PRIMARY KEY ("role_id", "permission_id"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b36cb2e04bc353ca4ede00d87b" ON "role_permissions_permission" ("role_id") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_bfbc9e263d4cea6d7a8c9eb3ad" ON "role_permissions_permission" ("permission_id") `
    );
    await queryRunner.query(
      `CREATE TABLE "permission_roles_role" ("permission_id" character varying NOT NULL, "role_id" character varying NOT NULL, CONSTRAINT "PK_534958b0063b8ad39335d7bcfd0" PRIMARY KEY ("permission_id", "role_id"))`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_9f44b6228b173c7b9dfb8c6600" ON "permission_roles_role" ("permission_id") `
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_7ec93d4fbf75b063f3ffd2646a" ON "permission_roles_role" ("role_id") `
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD "role_id" character varying`
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_fb2e442d14add3cefbdf33c456" ON "user" ("role_id") `
    );
    await queryRunner.query(
      `ALTER TABLE "user" ADD CONSTRAINT "FK_fb2e442d14add3cefbdf33c4561" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions_permission" ADD CONSTRAINT "FK_b36cb2e04bc353ca4ede00d87b9" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions_permission" ADD CONSTRAINT "FK_bfbc9e263d4cea6d7a8c9eb3ad2" FOREIGN KEY ("permission_id") REFERENCES "permission"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
    await queryRunner.query(
      `ALTER TABLE "permission_roles_role" ADD CONSTRAINT "FK_9f44b6228b173c7b9dfb8c66003" FOREIGN KEY ("permission_id") REFERENCES "permission"("id") ON DELETE CASCADE ON UPDATE CASCADE`
    );
    await queryRunner.query(
      `ALTER TABLE "permission_roles_role" ADD CONSTRAINT "FK_7ec93d4fbf75b063f3ffd2646a5" FOREIGN KEY ("role_id") REFERENCES "role"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "permission_roles_role" DROP CONSTRAINT "FK_7ec93d4fbf75b063f3ffd2646a5"`
    );
    await queryRunner.query(
      `ALTER TABLE "permission_roles_role" DROP CONSTRAINT "FK_9f44b6228b173c7b9dfb8c66003"`
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions_permission" DROP CONSTRAINT "FK_bfbc9e263d4cea6d7a8c9eb3ad2"`
    );
    await queryRunner.query(
      `ALTER TABLE "role_permissions_permission" DROP CONSTRAINT "FK_b36cb2e04bc353ca4ede00d87b9"`
    );
    await queryRunner.query(
      `ALTER TABLE "user" DROP CONSTRAINT "FK_fb2e442d14add3cefbdf33c4561"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_fb2e442d14add3cefbdf33c456"`
    );
    await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "role_id"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_7ec93d4fbf75b063f3ffd2646a"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_9f44b6228b173c7b9dfb8c6600"`
    );
    await queryRunner.query(`DROP TABLE "permission_roles_role"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_bfbc9e263d4cea6d7a8c9eb3ad"`
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b36cb2e04bc353ca4ede00d87b"`
    );
    await queryRunner.query(`DROP TABLE "role_permissions_permission"`);
    await queryRunner.query(`DROP TABLE "permission"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_29259dd58b1052aef9be56941d"`
    );
    await queryRunner.query(`DROP TABLE "role"`);
  }
}
