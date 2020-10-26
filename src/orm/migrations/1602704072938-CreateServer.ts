import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from 'typeorm';

export class CreateServer1602704072938 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'server',
				columns: [
					new TableColumn({ name: 'id', type: 'text', isNullable: false, isPrimary: true }),
					new TableColumn({ name: 'name', type: 'text', isNullable: false }),
					new TableColumn({ name: 'ownerId', type: 'text', isNullable: false })
				],
				foreignKeys: [
					new TableForeignKey({
						columnNames: ['ownerId'],
						referencedTableName: 'user',
						referencedColumnNames: ['id'],
						onDelete: 'CASCADE'
					})
				]

			})
		);

	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable('server');
	}

}
