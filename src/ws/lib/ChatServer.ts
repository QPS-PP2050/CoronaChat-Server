import { HttpsServer } from '@https/lib/HttpsServer';
import { Server } from '@orm/entities/Server';
import { ChatEvent } from './Constants';
import { getRepository } from 'typeorm';
import * as socketIO from 'socket.io';

import type { ChatMessage } from './types/ChatMessage';
import type { Server as httpsServer } from 'https';
import type { Server as httpServer } from 'http';
import type { Session } from '@api/lib/types';
import { wsAuthorization } from './middleware/wsAuthorization';

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
            const servers = await getRepository(Server).find({
                select: ['id', 'name'],
                where: {
                    owner: socket.session.id
                }
            })
            this.io.emit('servers', servers);
            
            socket.on(ChatEvent.DISCONNECT, () => {
                console.log('Client disconnected');
            });
        });

        const servers = this.io.of(/^\/\d+$/);
        servers.on(ChatEvent.CONNECT, (socket) => {
            const server = socket.nsp;
            console.log('Connected client to namespace %s.', server.name);
            socket.join('general', () => {
                socket.room = 'general'
            });
            console.log(socket.rooms)
            this.updateMembers(server);

            socket.on(ChatEvent.CHANNEL_CHANGE, (channelID: string) => {
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

    private async updateMembers(nsp: socketIO.Namespace) {
        nsp.clients((err: any, clients: []) => {
            if (err) throw err;
            console.log(clients)
            nsp.emit(ChatEvent.MEMBERLIST, clients);
        })
    }
}