import { HttpsServer } from '../../https/lib/HttpsServer';
import { ChatEvent } from './Constants';
import * as socketIO from 'socket.io';

import type { ChatMessage } from './types/ChatMessage';
import type { Server } from 'https';
import type { Server as aServer } from 'http';

export class ChatServer {

    private server: Server | aServer;
    private port: string | number;
    private io!: SocketIO.Server;

    public constructor(server: Server | aServer) {
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
        this.io.on(ChatEvent.CONNECT, (socket: any) => {
            console.log('Connected client on port %s.', this.port);
            /* socket.on(ChatEvent.MESSAGE, (m: ChatMessage) => {
                console.log('[server](message): %s', JSON.stringify(m));
                this.io.emit('message', m);
            }); */
            socket.on(ChatEvent.DISCONNECT, () => {
                console.log('Client disconnected');
            });
        });

        const servers = this.io.of(/^\/\d+$/);
        servers.on(ChatEvent.CONNECT, (socket) => {
            const server = socket.nsp;
            console.log('Connected client to namespace %s.', server.name);
            socket.join('general');
            console.log(socket.rooms)
            this.updateMembers(server);

            socket.on(ChatEvent.CHANNEL_CHANGE, (channelID: string) => {
                console.log(channelID)
                socket.leaveAll();
                socket.join(channelID);
            })

            socket.on(ChatEvent.MESSAGE, (m: ChatMessage) => {
                console.log(`${server.name}(message): %s`, JSON.stringify(m))
                server.to('general').emit('message', m);
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