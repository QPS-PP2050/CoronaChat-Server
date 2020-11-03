/* eslint-disable no-duplicate-imports */

import * as express from 'express';
import { createServer } from 'https';
import { createServer as aCreateServer } from 'http';
import { readFileSync } from 'fs';
import { join } from 'path';

import type { ServerOptions, Server } from 'https';
import type { Server as aServer } from 'http';

export class HttpsServer {

	private _app: express.Application;
	private port: string | number;
	private _server: Server | aServer;

	public constructor() {
		this._app = express();
		this.port = process.env.PORT || HttpsServer.PORT;
		this._server = process.env.USER === 'gitpod' ? aCreateServer(this._app) : createServer(HttpsServer.getOptions(), this._app);
		this._app.use(express.json());
		this.listen();
	}

	private listen(): void {
		// server listening on our defined port
		this._server.listen(this.port, () => {
			console.log('Running server on port %s', this.port);
		});
	}

	public static readonly PORT: number = 8080;

	private static getOptions(): ServerOptions {
		const env = process.env.NODE_ENV || 'development';
		return env === 'development'
			? {
				cert: readFileSync(join(process.cwd(), 'ssl/dev.cert')),
				key: readFileSync(join(process.cwd(), 'ssl/dev.key'))
			}
			: {
				cert: readFileSync(join(process.cwd(), 'ssl/fullchain.pem')),
				key: readFileSync(join(process.cwd(), 'ssl/privkey.pem'))
			};
	}

	public get app(): express.Application {
		return this._app;
	}

	public get server(): Server | aServer {
		return this._server;
	}

}
