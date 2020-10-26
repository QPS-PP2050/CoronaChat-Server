import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddAvatarURL1603611547532 implements MigrationInterface {
    name = 'AddAvatarURL1603611547532'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn('user',
            new TableColumn({ name: 'avatarURL', type: 'text', isNullable: false })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('user', 'avatarURL')
    }
}
