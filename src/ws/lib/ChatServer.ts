import { HttpsServer } from '@https/lib/HttpsServer';
import { Server } from '@orm/entities/Server';
import { Channel } from '@orm/entities/Channel';
import { ChatEvent } from '@utils/Constants';
import { wsAuthorization } from './middleware/wsAuthorization';
import { getRepository } from 'typeorm';
import * as socketIO from 'socket.io';

import type { Server as httpsServer } from 'https';
import type { Server as httpServer } from 'http';
import type { ChatMessage, Session } from '@utils/Types';

declare module 'socket.io' {
    interface Socket {
        room: string;
        session: Session;
    }
}

export class ChatServer {

    private server: httpsServer | httpServer;
    private port: string | number;
    private io!: SocketIO.Server;

    public constructor(server: httpsServer | httpServer) {
        this.server = server;
        this.port = HttpsServer.PORT;
        this.initSocket();
        this.listen();
    }

    private initSocket(): void {
        this.io = socketIO(this.server);
    }

    private listen(): void {
        //socket events
        this.io.use(wsAuthorization);
        this.io.on(ChatEvent.CONNECT, async (socket: any) => {
            console.log('Connected client on port %s.', this.port);
            
            const serverList = await this.updateServers(socket.session.id);
            this.io.emit('servers', serverList);

            socket.on('invite-user', async (data: any) => {
                if (socket.session.username !== data.username) return;
                const updatedServers = await this.updateServers(socket.session.id)
                this.io.emit('servers', updatedServers);
            })

            socket.on(ChatEvent.DISCONNECT, () => {
                console.log('Client disconnected');
            });
        });

        const servers = this.io.of(/^\/\d+$/);
        servers.use(wsAuthorization);
        servers.on(ChatEvent.CONNECT, async (socket) => {
            const server = socket.nsp;
            console.log('Connected client to namespace %s.', server.name);

            const channels = await getRepository(Channel).find({
                select: ['id', 'name', 'type'],
                where: {
                    server: server.name.split('/')[1]
                }
            })

            channels.sort((a, b) => (a.type > b.type) ? 1 : ((b.type > a.type) ? -1 : 0));

            socket.emit(ChatEvent.CHANNEL, channels);

            const generalChannel = channels.find(c => c.name === "general")!.id
            socket.join(generalChannel, () => {
                socket.room = generalChannel
            });
            console.log(socket.rooms)
            this.updateMembers(server);

            socket.on(ChatEvent.CHANNEL_CHANGE, (channelID: string) => {
                console.log(channelID)
                if (socket.room !== channelID) {
                    socket.leave(socket.room);
                    socket.room = channelID;
                    socket.join(channelID);
                }
            })

            socket.on(ChatEvent.MESSAGE, (m: ChatMessage) => {
                console.log(`${server.name}(message): %s`, JSON.stringify(m))
                server.to(m.channel).emit('message', m);
            })

            socket.on(ChatEvent.DISCONNECT, () => {
                this.updateMembers(server);
            })
        })

        servers.use((socket, next) => {
            next();
        })
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
        const members = Object.values(nsp.connected).map(s => s.session.username)
        console.log(members)
        nsp.emit(ChatEvent.MEMBERLIST, members);
    }
}