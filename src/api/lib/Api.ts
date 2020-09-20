import { Application } from 'express';
import { getConnection } from 'typeorm';

import { connect } from './../../orm/dbConfig';
import { User } from "./../../orm/entities/User";

var bodyParser = require('body-parser');

/*
The following code works on changing the account's email.

To use and test the database:
1. You may use Postman or use the Rest Client VSCode extenstion (ext ID: humao.rest-client).
    - Using Rest Client will allow you to use the request.rest file which is easier.
2. In one terminal, run "yarn watch" then run "yarn nodemon" in another terminal.
3. Open up the request.rest file (if using an alternative app, refer to the request.rest
    file to see what you need to do).
4. If the Rest Client is installed, above the POST request link, there is a button that
    says "Send Request".
5. To test email change, send a request under the change email request comment. You should
    be notified that the email for that account has been changed and pressing it again shoul tell
    that said email already exists.
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

        // The following method is to change a user's email
        this.app.post('/users/changeemail', async (req, res) => {
            /* 
            The email regex variable will be compared with the
                email the user provides. The email will be considered valid
                based on certain conditions:
            - If there are no illegal characters (only dash and underscore allowed)
            - If the beginning character is alphanumeric
            - An '@' is present and does not have a dot before or after it
            - No consecutive dots 
            */
            var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            // Var below will compare the user input with regex above to see if it is a valid email
            var compare = req.body.email.match(emailRegex);

            if (!compare) {
                /*
                If email is invalid, a 400 error status code will be sent indicating 
                    that the email format is invalid.
                */
                return res.status(400).send('Email is using invalid characters');
            } else {
                // The user's input is then searched through the database to see if there is a match
                const userAccount = await checkEmail(req.body.email);

                if (userAccount !== undefined) {
                    /*
                    If an account under than email already exists, a 400 error status code
                        will be sent along with a message telling the user that an account under
                        that email exists.
                    */
                    return res.status(400).send('That email already exists');
                } else {
                    /* 
                    If the email is not linked to any account, the current email will be replaced
                        with the user's new chosen email which will be updated in database.
                    */
                    try {

                        // Updating the local SQL database
                        await getConnection()
                            .createQueryBuilder()
                            .update(User)
                            .set({ email: req.body.email })
                            .where("id = :id", { id: req.body.id })
                            .execute();

                        /*
                        A 201 success status code will be sent along with a message 
                            telling the user that the account was successfully created.
                        */
                        return res.status(201).send("Email changed");
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
        The checkEmail function searches through the database and checks if an account with 
            the email exists. It will return a user if it finds a match. Otherwise, it will
            return undefined.
        */
        async function checkEmail(emailInput: String): Promise<any> {
            try {
                // Establishes connection
                const connection = await connect();

                // Temp code
                // await getConnection()
                //     .createQueryBuilder()
                //     .delete()
                //     .from(User)
                //     .execute();

                // SELECT search query to find if a user has the same email
                const userQuery = await connection
                    .createQueryBuilder()
                    .select("user")
                    .from(User, "user")
                    .where("user.email = :email", { email: emailInput })
                    .getRawOne();

                // Returns undefined if no match
                return userQuery;
            } catch (err) {
                console.log(err);
            }
        }
    }
}