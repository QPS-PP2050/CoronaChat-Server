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
            this.io.clients((err: any, clients: []) => {
                if (err) throw err;
                console.log(clients)
                this.io.emit(ChatEvent.MEMBERLIST, clients);
            })
            console.log('Connected client on port %s.', this.port);
            socket.on(ChatEvent.MESSAGE, (m: ChatMessage) => {
                console.log('[server](message): %s', JSON.stringify(m));
                this.io.emit('message', m);
            });
            socket.on(ChatEvent.DISCONNECT, () => {
                this.io.clients((err: any, clients: []) => {
                if (err) throw err;
                console.log(clients)
                this.io.emit(ChatEvent.MEMBERLIST, clients);
            })
                console.log('Client disconnected');
            });
        });
    }
}