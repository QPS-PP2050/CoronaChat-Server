import { MigrationInterface, QueryRunner, Table, TableColumn } from 'typeorm';

export class CreateUser1602700401563 implements MigrationInterface {

	public async up(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.createTable(
			new Table({
				name: 'user',
				columns: [
					new TableColumn({ name: 'id', type: 'text', isNullable: false, isPrimary: true }),
					new TableColumn({ name: 'username', type: 'text', isNullable: false }),
					new TableColumn({ name: 'password', type: 'text', isNullable: false }),
					new TableColumn({ name: 'email', type: 'text', isNullable: false })
				]

			})
		);

	}

	public async down(queryRunner: QueryRunner): Promise<void> {
		await queryRunner.dropTable('user');
	}

}
