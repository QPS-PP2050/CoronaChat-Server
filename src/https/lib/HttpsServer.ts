import * as express from 'express';
import { createServer } from 'https';
import { createServer as aCreateServer } from 'http';
import { readFileSync } from 'fs';
import { join } from 'path';

import type { ServerOptions, Server } from 'https';
import type { Server as aServer } from 'http';

export class HttpsServer {

	public static readonly PORT: number = 8080;

	private _app: express.Application;
	private port: string | number;
	private _server: Server | aServer;

	public constructor() {
		this._app = express();
		this.port = process.env.PORT || HttpsServer.PORT;
		this._server = process.env.USER == 'gitpod' ? aCreateServer(this._app) : createServer(HttpsServer.getOptions(), this._app);
		this._app.use(express.json());
		this.listen();
	}

	private static getOptions(): ServerOptions {
		const env = process.env.NODE_ENV || 'development';
		console.log(join(process.cwd(), '/ssl/dev.cert'));
		return env == 'development' ? {
			cert: readFileSync(join(process.cwd(), '/ssl/dev.cert')),
			key: readFileSync(join(process.cwd(), 'ssl/dev.key'))
		} : {
			cert: readFileSync(join(process.cwd(), 'ssl/fullchain.pem')),
			key: readFileSync(join(process.cwd(), 'ssl/privkey.pem'))
		};
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

	get server(): Server | aServer {
		return this._server;
	}

}
