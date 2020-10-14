import {MigrationInterface, QueryRunner, Table, TableColumn} from "typeorm";

export class CreateServer1602700401563 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        queryRunner.createTable(
            new Table({
                name: "server",
                columns: [
                    new TableColumn({ name: 'id', type: 'string', isNullable: false, isPrimary: true }),
                    new TableColumn({ name: 'name', type: 'string', isNullable: false }),
                    new TableColumn({ name: 'ownerid', type: 'string', isNullable: false})
                ]

            })
        )

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
