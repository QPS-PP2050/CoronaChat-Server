import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from "typeorm";

export class CreateMembers1602704395087 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.createTable(
            new Table({
                name: "members",
                columns: [
                    new TableColumn({ name: 'server', type: 'text', isNullable: false, isPrimary: true }),
                    new TableColumn({ name: 'user', type: 'text', isNullable: false, isPrimary: true })
                ],
                foreignKeys: [
                    new TableForeignKey({
                        columnNames: ['server'],
                        referencedTableName: 'server',
                        referencedColumnNames: ['id'],
                        onDelete: "CASCADE"
                    }),
                    new TableForeignKey({
                        columnNames: ['user'],
                        referencedTableName: 'user',
                        referencedColumnNames: ['id'],
                        onDelete: "CASCADE"
                    })
                ]
            })
        )

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('members');
    }

}
