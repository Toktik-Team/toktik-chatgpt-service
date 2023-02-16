import { MigrationInterface, QueryRunner } from "typeorm";

export class migration1676561421398 implements MigrationInterface {
    name = 'migration1676561421398'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "chat_gpt_session" ("id" SERIAL NOT NULL, "userID" integer NOT NULL, "conversationId" character varying NOT NULL, "parentMessageId" character varying NOT NULL, CONSTRAINT "PK_6786615225b08e64f059882111e" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "chat_gpt_session"`);
    }

}
