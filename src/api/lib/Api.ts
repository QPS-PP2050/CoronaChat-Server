import { Application } from 'express';
import { getConnection } from 'typeorm';

import { connect } from './../../orm/dbConfig';
import { User } from "./../../orm/entities/User";

var bodyParser = require('body-parser');

/* The following code is to work with creating a localised database
and creating a register and login feature that uses salt from bcrypt
to hash passwords to increased security.

To use and test the database:
1. You may use Postman or use the Rest Client VSCode extenstion (ext ID: humao.rest-client).
    - Using Rest Client will allow you to use the request.rest file which is easier.
2. In one terminal, run "npm run build" then run "npm run start" in another terminal 
3. Open up the request.rest file (if using an alternative app, refer to the request.rest
    file to see what you need to do).
4. If the Rest Client is installed, above the POST request link, there is a button that
    says "Send Request".
5. To test user registration, send a reuqest under the register request comment. You should
    be notified that an account has been made and pressing it again should tell an account has
    already been made under that email.
6. To check, send a request under the show users request comment to see the list of user emails
    and hashed passwords.
7. To test the login feature, send a request under the login request comment. By default, the
    email and password for the register and login request are the same, so login will be succesful.
    If you change the login details and no such info exists, it will respond saying it doesn't exist.

There is no limit to user accounts, so make as much as you want to test the regex. Please do note
    that the list empties out upon terminating the program. */

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
        // A test method to see if the register/login methods work
        this.app.get('/users', async (req, res) => {
            try {
                const connection = await connect();
                const users = await connection.manager.find(User);

                res.json(users);
            } catch (err) {
                console.log(err);

            }import { Application } from 'express';
            import { getConnection } from 'typeorm';
            
            import { connect } from './../../orm/dbConfig';
            import { User } from "./../../orm/entities/User";
            
            var bodyParser = require('body-parser');
            
            /* The following code is to work with creating a localised database
            and creating a register and login feature that uses salt from bcrypt
            to hash passwords to increased security.
            
            To use and test the database:
            1. You may use Postman or use the Rest Client VSCode extenstion (ext ID: humao.rest-client).
                - Using Rest Client will allow you to use the request.rest file which is easier.
            2. In one terminal, run "npm run build" then run "npm run start" in another terminal 
            3. Open up the request.rest file (if using an alternative app, refer to the request.rest
                file to see what you need to do).
            4. If the Rest Client is installed, above the POST request link, there is a button that
                says "Send Request".
            5. To test user registration, send a reuqest under the register request comment. You should
                be notified that an account has been made and pressing it again should tell an account has
                already been made under that email.
            6. To check, send a request under the show users request comment to see the list of user emails
                and hashed passwords.
            7. To test the login feature, send a request under the login request comment. By default, the
                email and password for the register and login request are the same, so login will be succesful.
                If you change the login details and no such info exists, it will respond saying it doesn't exist.
            
            There is no limit to user accounts, so make as much as you want to test the regex. Please do note
                that the list empties out upon terminating the program. */
            
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
                    // A test method to see if the register/login methods work
                    this.app.get('/users', async (req, res) => {
                        try {
                            const connection = await connect();
                            const users = await connection.manager.find(User);
            
                            res.json(users);
                        } catch (err) {
                            console.log(err);
            
                        }
                    });
            
                    // The following method is to register a new user to the database
                    this.app.post('/users/changeusername', async (req, res) => {
            
                        var usernameRegex = /^\D[a-z0-9]{8,16}$/;
            
                        var compare = req.body.username.match(usernameRegex);
            
                        if (!compare) {
            
                            return res.status(400).send('Username is using invalid characters');
                        } else {
            
                            const userAccount = await checkUsername(req.body.username);
            
                            if (userAccount !== undefined) {
                                return res.status(400).send('That username already exists');
                            } else {
                                try {
                                    await getConnection()
                                        .createQueryBuilder()
                                        .update(User)
                                        .set({ username: req.body.username })
                                        .where("id = :id", { id: req.body.id })
                                        .execute();
            
                                    return res.status(201).send("Username changed");
                                } catch (err) {
                                    console.log(err);
                                }
                            }
                        }
                    });
            
                    async function checkUsername(usernameInput: String): Promise<any> {
                        try {
                            const connection = await connect();
            
                            // await getConnection()
                            //     .createQueryBuilder()
                            //     .delete()
                            //     .from(User)
                            //     .execute();
            
                            const userQuery = await connection
                                .createQueryBuilder()
                                .select("user")
                                .from(User, "user")
                                .where("user.username = :username", { username: usernameInput })
                                .getRawOne();
            
                            // console.log(userQuery.password);
            
                            return userQuery;
                        } catch (err) {
                            console.log(err);
                        }
                    }
                }
            
            
            }
            
        });

        // The following method is to register a new user to the database
        this.app.post('/users/changeuser', async (req, res) => {

            var usernameRegex = /^\D[a-z0-9]{8,16}$/;

            var compare = req.body.username.match(usernameRegex);

            if (!compare) {

                return res.status(400).send('Username is using invalid characters');
            } else {

                const userAccount = await checkUsername(req.body.username);

                if (userAccount !== undefined) {
                    return res.status(400).send('That username already exists');
                } else {
                    try {
                        await getConnection()
                            .createQueryBuilder()
                            .update(User)
                            .set({ username: req.body.username })
                            .where("id = :id", { id: req.body.id })
                            .execute();

                        return res.status(201).send("Username changed");
                    } catch (err) {
                        console.log(err);
                    }
                }
            }
        });

        async function checkUsername(usernameInput: String): Promise<any> {
            try {
                const connection = await connect();

                // await getConnection()
                //     .createQueryBuilder()
                //     .delete()
                //     .from(User)
                //     .execute();

                const userQuery = await connection
                    .createQueryBuilder()
                    .select("user")
                    .from(User, "user")
                    .where("user.username = :username", { username: usernameInput })
                    .getRawOne();

                // console.log(userQuery.password);

                return userQuery;
            } catch (err) {
                console.log(err);
            }
        }
    }


}
