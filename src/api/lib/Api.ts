import * as bcrypt from 'bcrypt';

import { Application } from 'express';
// import { getConnection } from 'typeorm';

import { connect } from './../../orm/dbConfig';
import { User } from "./../../orm/entities/User";

var bodyParser = require('body-parser');

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
                console.log(users);

                res.json(users);
            } catch (err) {
                console.log(err);

            }
        });

        // The following method is to register a new user to the database
        this.app.post('/users', async (req, res) => {

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
                /* If email is invalid, a 400 error status code will be sent indicating 
                    that the email format is invalid */
                return res.status(400).send('Email/username is using invalid characters');
            } else {
                // Will go through the database to see if a user exists
                const userAccount = await checkUserEmail(req.body.email);

                if (userAccount !== undefined) {
                    /* 
                    If an account under than email already exists, a 400 error status code
                        will be sent along with a message telling the user that an account under
                        that email exists.
                    */
                    return res.status(400).send('Account under that email already exists');
                } else {
                    /*
                    If the email is not linked to any account, the password will be hashed
                        using salt and the email and hashed password will be pushed to the users
                        database.
                    */
                    try {
                        const hashedPassword = await bcrypt.hash(req.body.password, 10);

                        // Pushing to local SQL database
                        try {
                            const connection = await connect();
                            const newUser = new User();
                            newUser.id = 1;
                            newUser.username = "undefined";
                            newUser.password = hashedPassword;
                            newUser.email = req.body.email;
                            await connection.manager.save(newUser);
                        } catch (err) {
                            console.log(err);
                        }
                        /* 
                        A 201 success status code will be sent along with a message 
                            telling the user that the account was successfully created.
                        */
                        res.status(201).send('Account created');
                    } catch {
                        /* 
                        In any odd event something goes wrong whilst the account is being 
                            created, a 500 status code will be sent.
                        */
                        res.status(500).send('Unknown Error');
                    }

                }
            }
        });

        // The following method is to login a user by seeing if a certain account exists in the database
        this.app.post('/users/login', async (req, res) => {
            // The user's input is then searched through the database to see if there is a match
            const userAccount = await checkUserEmail(req.body.email);

            if (userAccount == undefined) {
                /*
                If the account already exists, a 400 status code error will be sent along with 
                    a message telling the user there is no account under that email.
                */
                return res.status(400).send('Account under this email/username does not exist');
            } else {
                /* 
                If the email exists in the database, the database hashed password
                    will be compared with the password the user inputted. If the passwords match, a
                    response will be sent telling the user that they have successfully logged in.
                */
                try {
                    if (!await bcrypt.compare(req.body.password, userAccount.user_password)) {
                        res.send('Login failed');
                    } else {
                        res.send('Success');

                    }
                } catch {
                    /* 
                    In any odd event something goes wrong whilst the user is trying to
                        log in, a 500 status code will be sent.
                    */
                    res.status(500).send();
                }
            }
        });

        /* 
        The checkUserEmail function searches through the database and checks if an account with 
            the email exists. It will return a user if it finds a match. Otherwise, it will
            return undefined.
        */
        async function checkUserEmail(emailInput: String): Promise<any> {
            try {
                // Establishes connection
                const connection = await connect();

                // await getConnection()
                //     .createQueryBuilder()
                //     .delete()
                //     .from(User)
                //     .execute();

                const emailQuery = await connection
                    .createQueryBuilder()
                    .select("user")
                    .from(User, "user")
                    .where("user.email = :email", { email: emailInput })
                    .getRawOne();

                // console.log(emailQuery);

                // Returns undefined if no match
                return emailQuery;
            } catch (err) {
                console.log(err);
            }
        }
    }


}
