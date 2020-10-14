import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from "typeorm";

export class CreateChannel1602704072939 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.createTable(
            new Table({
                name: "channel",
                columns: [
                    new TableColumn({ name: 'id', type: 'text', isNullable: false, isPrimary: true }),
                    new TableColumn({ name: 'name', type: 'text', isNullable: false }),
                    new TableColumn({ name: 'type', type: 'text', isNullable: false }),
                    new TableColumn({ name: 'serverId', type: 'text', isNullable: false })
                ],
                foreignKeys: [
                    new TableForeignKey({
                        columnNames: ['serverId'],
                        referencedTableName: 'server',
                        referencedColumnNames: ['id'],
                        onDelete: "CASCADE"
                    })
                ]
            })
        )

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('channel');
    }

}
