import * as express from 'express';
import { createServer, Server } from 'http';

export class HttpServer {
    public static readonly PORT: number = 8080;

    private _app: express.Application
    private port: string | number;
    private _server: Server;

    public constructor() {
        this._app = express();
        this.port = process.env.PORT || HttpServer.PORT;
        this._server = createServer(this._app);
        this._app.use(express.json());
        this.listen();
    }

    private listen(): void {
        // server listening on our defined port
        this._server.listen(this.port, () => {
            console.log('Running server on port %s', this.port);
        });
    }

    get app(): express.Application {
        return this._app;
    }

    get server(): Server {
        return this._server;
    }
}