/* eslint-disable @typescript-eslint/no-unused-vars */

import { Entity, Column, ManyToMany, OneToMany, OneToOne, JoinColumn, JoinTable } from 'typeorm';
import { Structure } from './Structure';
import { Channel } from './Channel';
import { User } from './User';

@Entity()
export class Server extends Structure {

	@Column('text')
	public name: string | null = null;

	@OneToOne(type => User, { onDelete: 'CASCADE' })
	@JoinColumn()
	public owner!: User;

	@ManyToMany(type => User, user => user.servers, { onDelete: 'CASCADE' })
	@JoinTable({
		name: 'members',
		joinColumn: {
			name: 'server',
			referencedColumnName: 'id'
		},
		inverseJoinColumn: {
			name: 'user',
			referencedColumnName: 'id'
		}

	})
	public members!: User[];

	@OneToMany(type => Channel, channel => channel.server)
	public channels!: Channel[];

}
