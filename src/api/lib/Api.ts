import * as bcrypt from 'bcrypt';

import { Application } from 'express';
import { getConnection } from 'typeorm';

import { connect } from './../../orm/dbConfig';
import { User } from "./../../orm/entities/User";

var bodyParser = require('body-parser');

/*
The following code works on changing the account's password.

To use and test the database:
1. You may use Postman or use the Rest Client VSCode extenstion (ext ID: humao.rest-client).
    - Using Rest Client will allow you to use the request.rest file which is easier.
2. In one terminal, run "yarn watch" then run "yarn nodemon" in another terminal.
3. Open up the request.rest file (if using an alternative app, refer to the request.rest
    file to see what you need to do).
4. If the Rest Client is installed, above the POST request link, there is a button that
    says "Send Request".
5. To test password change, send a request under the change password request comment. You should
    be notified that the password for that account has been changed and pressing it again shoul tell
    that said password already exists.
6. To check, send a request under the show users request comment to see the list of users 
    and their details.
*/

export class Api {

    private app: Application;

    public constructor(app: Application) {
        this.app = app;
        this.registerRoutes()
        app.use(bodyParser.json());
        console.log("api online")
    }

    // TODO: Implement a better Route handler
    private registerRoutes(): void {
        // A temp method that shows all the user's details
        this.app.get('/users', async (req, res) => {
            try {
                const connection = await connect();
                const users = await connection.manager.find(User);

                res.json(users);
            } catch (err) {
                console.log(err);

            }
        });

        // The following method is to change a user's password
        this.app.post('/users/changepassword', async (req, res) => {
            try {
                // const hashedPassword = await bcrypt.hash(req.body.password, 10);

                // Updating the local SQL database
                await getConnection()
                    .createQueryBuilder()
                    .update(User)
                    .set({ password: await bcrypt.hash(req.body.password, 10) })
                    .where("id = :id", { id: req.body.id })
                    .execute();

                /*
                A 201 success status code will be sent along with a message 
                    telling the user that the account was successfully created.
                */
                return res.status(201).send("Password changed");
            } catch (err) {
                /* 
                In any odd event something goes wrong whilst the account is being 
                    created, a 500 status code will be sent.
                */
                console.log(err);
            }
        });
    }
}