import 'reflect-metadata';
import 'module-alias/register';
import dotEnvExtended from 'dotenv-extended';

dotEnvExtended.load();

import { connect } from './orm/dbConfig';
import { HttpsServer } from './https';
import { ChatServer } from './ws';
import { Api } from './api';

void connect().then(() => {
	const https = new HttpsServer();

	new ChatServer(https.server);
	new Api(https.app);
});
