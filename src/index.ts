import { HttpServer } from './http';
import { ChatServer } from './ws';
import { Api } from './api';

const http = new HttpServer();

new ChatServer(http.server);
new Api(http.app);