import { HttpsServer } from '@https/lib/HttpsServer';
import { Channel, Server, User } from '@orm/entities';
import { ChatEvent } from '@utils/Constants';
import { wsAuthorization } from './middleware/wsAuthorization';
import { getRepository } from 'typeorm';
import * as socketIO from 'socket.io';

import type { Server as httpsServer } from 'https';
import type { Server as httpServer } from 'http';
import type { ChatMessage, Session } from '@utils/Types';
import { WebRTC } from '@root/webrtc';

declare module 'socket.io' {
	interface Socket {
		room: string;
		room_id: string | '';
		session: Session;
	}
}

export class ChatServer {

	private server: httpsServer | httpServer;
	private port: string | number;
	private io!: SocketIO.Server;
	private voice: WebRTC;

	public constructor(server: httpsServer | httpServer) {
		this.server = server;
		this.port = HttpsServer.PORT;
		this.voice = new WebRTC();
		this.initSocket();
		this.listen();
	}

	private initSocket(): void {
		this.io = socketIO(this.server);
	}

	private listen(): void {
		// socket events
		this.io.use(wsAuthorization);
		this.io.on(ChatEvent.CONNECT, async (socket: any) => {
			console.log('Connected client on port %s.', this.port);

			const userProfile = await this.getProfile(socket.session.id);
			socket.emit('profile', userProfile);

			const serverList = await this.updateServers(socket.session.id);
			socket.emit('servers', serverList);

			socket.on('invite-user', async (data: any) => {
				if (socket.session.username !== data.username) return;
				const updatedServers = await this.updateServers(socket.session.id);
				this.io.emit('servers', updatedServers);
			});

			socket.on(ChatEvent.DISCONNECT, () => {
				console.log('Client disconnected');
			});
		});

		const voice = this.io.of('/voice');
		voice.on(ChatEvent.CONNECT, socket => {
			this.voice.handleSignal(socket);
		});
		voice.use((socket, next) => {
			next();
		});

		const servers = this.io.of(/^\/\d+$/);
		servers.use(wsAuthorization);
		servers.on(ChatEvent.CONNECT, async socket => {
			const server = socket.nsp;
			console.log('Connected client to namespace %s.', server.name);

			const channelList = await this.updateChannels(server);

			socket.emit(ChatEvent.CHANNEL, channelList);

			const generalChannel = channelList.find(c => c.name === 'general')!.id;
			socket.join(generalChannel, () => {
				socket.room = generalChannel;
			});
			console.log(socket.rooms);
			await this.updateMembers(server);

			socket.on(ChatEvent.CHANNEL_UPDATE, async () => {
				const channelList = await this.updateChannels(server);
				server.emit(ChatEvent.CHANNEL, channelList);
			})

			socket.on(ChatEvent.CHANNEL_CHANGE, (channelID: string) => {
				console.log(channelID);
				if (socket.room !== channelID) {
					socket.leave(socket.room);
					socket.room = channelID;
					socket.join(channelID);
				}
			});

			socket.on(ChatEvent.MESSAGE, (m: ChatMessage) => {
				console.log(`${server.name}(message): %s`, JSON.stringify(m));
				server.to(m.channel).emit('message', m);
			});

			socket.on(ChatEvent.DISCONNECT, async () => {
				await this.updateMembers(server);
			});
		});

		servers.use((socket, next) => {
			next();
		});
	}

	private async updateChannels(server: socketIO.Namespace) {
		const channels = await getRepository(Channel).find({
			select: ['id', 'name', 'type'],
			where: {
				server: server.name!.split('/')[1]
			}
		});

		channels.sort((a, b) => (a.type > b.type) ? 1 : ((b.type > a.type) ? -1 : 0));
		return channels;
	}

	private async updateServers(userID: string) {
		const servers = await getRepository(Server)
			.createQueryBuilder('server')
			.leftJoinAndSelect('server.members', 'user')
			.where('user.id = :id', { id: userID })
			.getMany();
		console.log(servers);
		return servers;
	}

	private async updateMembers(nsp: socketIO.Namespace) {
		const members = Object.values(nsp.connected).map(s => s.session.username);
		if (members.length > 0) {
			const memberList = await getRepository(User)
				.createQueryBuilder('user')
				.select(['user.avatarURL', 'user.username', 'user.id'])
				.where('user.username IN (:...names)', { names: members })
				.getMany();

			console.log(memberList);

			return nsp.emit(ChatEvent.MEMBERLIST, memberList);
		}
		return nsp.emit(ChatEvent.MEMBERLIST, []);

	}

	private async getProfile(id: string) {
		const memberAvatars = await getRepository(User)
			.createQueryBuilder('user')
			.select('user.avatarURL')
			.where('user.id = :id', { id })
			.getOne();

		console.log(memberAvatars);
		return memberAvatars!.avatarURL;
	}

}
