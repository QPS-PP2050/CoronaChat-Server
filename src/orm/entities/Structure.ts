import { PrimaryColumn } from 'typeorm';

export abstract class Structure {

	@PrimaryColumn('text')
	public id!: string;

}
