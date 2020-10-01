import * as bodyParser from 'body-parser';
import * as helmet from 'helmet';
// import cors from 'cors';

import users from './routes/user';
import servers from './routes/server';
import channels from './routes/channel';

import type { Application } from 'express';

export class Api {

    private app: Application;

    public constructor(app: Application) {
        this.app = app;
        this.app.use(bodyParser.json());
        // this.app.use(cors());
        this.app.use(helmet());

        this.app.use('/api', users);
        this.app.use('/api', servers);
        this.app.use('/api', channels);
        console.log("api online")
    }
}
