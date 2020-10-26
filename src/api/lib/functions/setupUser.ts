import { Channel, Server, User } from '@orm/entities';
import { ChannelType } from '@utils/Constants';
import * as Snowflake from '@utils/Snowflake';
import { getRepository } from 'typeorm';

import type { Request } from 'express';


export async function setupUser(req: Request, user: User) {
	const server = new Server();
	server.id = Snowflake.generate();
	server.name = req.body.name || `${user.username}'s Server`;
	server.owner = req.body.ownerID || user.id;
	server.members = [user];

	const channel = new Channel();
	channel.id = Snowflake.generate();
	channel.name = 'general';
	channel.type = ChannelType.TEXT;
	channel.server = server;

	const voiceChannel = new Channel();
	voiceChannel.id = Snowflake.generate();
	voiceChannel.name = 'voice';
	voiceChannel.type = ChannelType.VOICE;
	voiceChannel.server = server;

	await getRepository(Server).save(server);
	await getRepository(Channel).save(channel);
	await getRepository(Channel).save(voiceChannel);
	return server;
}
