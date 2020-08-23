import { ChatServer } from './ws';

let app = new ChatServer().app;

export { app };