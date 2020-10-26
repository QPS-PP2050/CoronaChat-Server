/* eslint-disable @typescript-eslint/no-unused-vars */

import { Entity, Column, ManyToOne } from 'typeorm';
import { Structure } from './Structure';
import { Server } from './Server';
import { ChannelType } from '@utils/Constants';

@Entity()
export class Channel extends Structure {

	@Column('text')
	public type!: ChannelType;

	@Column('text')
	public name!: string;

	@ManyToOne(type => Server, server => server.channels, { onDelete: 'CASCADE' })
	public server!: Server;

}
