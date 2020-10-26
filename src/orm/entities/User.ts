/* eslint-disable @typescript-eslint/no-unused-vars */

import { Entity, Column, ManyToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Structure } from './Structure';
import { Server } from './Server';

@Entity()
export class User extends Structure {

	@Column({
		type: 'text'
	})
	public username!: string;

	@Exclude()
	@Column('text')
	public password!: string;

	@Exclude()
	@Column('text')
	public email!: string;

	@Column('text')
	public avatarURL!: string;

	@ManyToMany(type => Server, server => server.members, { onDelete: 'CASCADE' })
	public servers?: Server[];

}
