import "reflect-metadata";

import { HttpsServer } from './https';
import { ChatServer } from './ws';
import { Api } from './api';

const https = new HttpsServer();

new ChatServer(https.server);
new Api(https.app);