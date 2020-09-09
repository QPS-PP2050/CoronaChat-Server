import { HttpServer } from '../../http/lib/HttpServer';
import { ChatEvent } from './Constants';
import * as socketIO from 'socket.io';

import type { ChatMessage } from './types/ChatMessage';
import type { Server } from 'http';

export class ChatServer {

    private server: Server;
    private port: string | number;
    private io!: SocketIO.Server;

    public constructor(server: Server) {
        this.server = server;
        this.port = HttpServer.PORT;
        this.initSocket();
        this.listen();
    }

    private initSocket(): void {
        this.io = socketIO(this.server);
    }

    private listen(): void {
        //socket events
        this.io.on(ChatEvent.CONNECT, (socket: any) => {
            console.log(this.io.sockets.sockets);
            console.log('Connected client on port %s.', this.port);
            socket.on(ChatEvent.MESSAGE, (m: ChatMessage) => {
                console.log('[server](message): %s', JSON.stringify(m));
                this.io.emit('message', m);
            });
            socket.on(ChatEvent.DISCONNECT, () => {
                console.log('Client disconnected');
            });
        });
    }
}