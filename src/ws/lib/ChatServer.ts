import * as express from 'express';
import * as socketIO from 'socket.io';
import { createServer, Server } from 'http';

import { ChatEvent } from './Constants';
import type { ChatMessage } from './types/ChatMessage';

export class ChatServer {

    public static readonly PORT: number = 8080;

    private _app: express.Application;
    private server: Server;
    private io!: SocketIO.Server;
    private port: string | number;

    public constructor() {
        this._app = express();
        this.port = process.env.PORT || ChatServer.PORT;
        this.server = createServer(this._app);
        this.initSocket();
        this.listen();
    }

    private initSocket(): void {
        this.io = socketIO(this.server);
    }

    private listen(): void {
        // server listening on our defined port
        this.server.listen(this.port, () => {
            console.log('Running server on port %s', this.port);
        });   
        
        //socket events
        this.io.on(ChatEvent.CONNECT, (socket: any) => {
            console.log('Connected client on port %s.', this.port); socket.on(ChatEvent.MESSAGE, (m: ChatMessage) => {
                console.log('[server](message): %s', JSON.stringify(m));
                this.io.emit('message', m);
            }); socket.on(ChatEvent.DISCONNECT, () => {
                console.log('Client disconnected');
            });
        });
    }

    get app(): express.Application {
        return this._app;
    }
}