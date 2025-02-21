import { MigrationInterface, QueryRunner } from "typeorm";

export class AddImageColumnInGrocery1740132368085 implements MigrationInterface {
    name = 'AddImageColumnInGrocery1740132368085'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "groceries" ADD "image" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "groceries" DROP COLUMN "image"`);
    }

}
