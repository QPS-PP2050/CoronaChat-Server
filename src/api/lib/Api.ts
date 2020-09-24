import * as bcrypt from 'bcrypt';

import bodyParser from 'body-parser';
import helmet from 'helmet';
import cors from 'cors';

import users from './routes/user';
import servers from './routes/server';
import channels from './routes/channel';
import { connect } from './../../orm/dbConfig';
import { User } from "./../../orm/entities/User";

import type { Application } from 'express';

/* 
The following code is to work with creating a localised database
and creating a register and login feature that uses salt from bcrypt
to hash passwords to increased security.

To use and test the database:
1. You may use Postman or use the Rest Client VSCode extenstion (ext ID: humao.rest-client).
    - Using Rest Client will allow you to use the request.rest file which is easier.
2. In one terminal, run "yarn watch" then run "yarn nodemon" in another terminal.
3. Open up the request.rest file (if using an alternative app, refer to the request.rest
    file to see what you need to do).
4. If the Rest Client is installed, above the POST request link, there is a button that
    says "Send Request".
5. To test user registration, send a request under the register request comment. You should
    be notified that an account has been made and pressing it again should tell an account has
    already been made under that email.
6. To check, send a request under the show users request comment to see the list of users.
7. To test the login feature, send a request under the login request comment. By default, the
    email and password for the register and login request are the same, so login will be succesful.
    If you change the login details and no such info exists, it will respond saying it doesn't exist.
*/

export class Api {

    private app: Application;

    public constructor(app: Application) {
        this.app = app;
        app.use(bodyParser.json());
        app.use(cors);
        app.use(helmet);

        app.use('/api', users);
        app.use('/api', servers);
        app.use('/api', channels);
        console.log("api online")
    }
}
