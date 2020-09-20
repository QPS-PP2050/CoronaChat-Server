import { Application } from 'express';
import { getConnection } from 'typeorm';

import { connect } from './../../orm/dbConfig';
import { User } from "./../../orm/entities/User";

var bodyParser = require('body-parser');

/*
The following code works on changing the account's username.

To use and test the database:
1. You may use Postman or use the Rest Client VSCode extenstion (ext ID: humao.rest-client).
    - Using Rest Client will allow you to use the request.rest file which is easier.
2. In one terminal, run "yarn watch" then run "yarn nodemon" in another terminal.
3. Open up the request.rest file (if using an alternative app, refer to the request.rest
    file to see what you need to do).
4. If the Rest Client is installed, above the POST request link, there is a button that
    says "Send Request".
5. To test username change, send a request under the change username request comment. You should
    be notified that the username for that account has been changed and pressing it again shoul tell
    that said username already exists.
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

        // The following method is to change a user's username
        this.app.post('/users/changeusername', async (req, res) => {
            /*
            The username regex variable will be compared with the username
            the user provides. The username will be considered valid
            based on certain conditions:
            - If there are no illegal characters 
            - If the beginning character is a letter
            - Only contains lowercase letters and numbers between 0 to 9
            - Is between 8 to 16 characters
            */
            var usernameRegex = /^\D[a-z0-9]{8,16}$/;
            // Var below will compare the user input with regex above to see if it is a valid username
            var compare = req.body.username.match(usernameRegex);

            if (!compare) {
                /*
                If username is invalid, a 400 error status code will be sent indicating 
                    that the username format is invalid.
                */
                return res.status(400).send('Username is using invalid characters');
            } else {
                // The user's input is then searched through the database to see if there is a match
                const userAccount = await checkUsername(req.body.username);

                if (userAccount !== undefined) {
                    /*
                    If an account under than username already exists, a 400 error status code
                        will be sent along with a message telling the user that an account under
                        that username exists.
                    */
                    return res.status(400).send('That username already exists');
                } else {
                    /* 
                    If the username is not linked to any account, the current username will be replaced
                        with the user's new chosen username which will be updated in database.
                    */
                    try {

                        // Updating the local SQL database
                        await getConnection()
                            .createQueryBuilder()
                            .update(User)
                            .set({ username: req.body.username })
                            .where("id = :id", { id: req.body.id })
                            .execute();

                        /*
                        A 201 success status code will be sent along with a message 
                            telling the user that the account was successfully created.
                        */
                        return res.status(201).send("Username changed");
                    } catch (err) {
                        /* 
                        In any odd event something goes wrong whilst the account is being 
                            created, a 500 status code will be sent.
                        */
                        console.log(err);
                    }
                }
            }
        });

        /* 
        The checkUsername function searches through the database and checks if an account with 
            the username exists. It will return a user if it finds a match. Otherwise, it will
            return undefined.
        */
        async function checkUsername(usernameInput: String): Promise<any> {
            try {
                // Establishes connection
                const connection = await connect();

                // Temp code
                // await getConnection()
                //     .createQueryBuilder()
                //     .delete()
                //     .from(User)
                //     .execute();

                // SELECT search query to find if a user has the same username
                const userQuery = await connection
                    .createQueryBuilder()
                    .select("user")
                    .from(User, "user")
                    .where("user.username = :username", { username: usernameInput })
                    .getRawOne();

                // Returns undefined if no match
                return userQuery;
            } catch (err) {
                console.log(err);
            }
        }
    }


}