import * as bcrypt from 'bcrypt';
import { Router } from 'express';
import { encodeSession, setupUser } from '../functions';
import { authorization } from '../middleware/authorization';
import { connect } from '@orm/dbConfig';
import { Server, User, Channel } from '@orm/entities';
import * as Snowflake from '@utils/Snowflake';
import { getRepository } from 'typeorm';
import { classToPlain } from 'class-transformer';

const router = Router();

// The following get request will return the list of users in a json format
router.get('/users', async (req, res) => {
    try {
        // Establishes connection
        const connection = await connect();

        // Finds the lists of users
        const users = await connection.manager.find(User);

        // Prints out the list of users via the extension
        res.json(users);
    } catch (err) {
        // Error checking if it ever goes wrong for whatever reason
        console.log(err);
    }
})

router.post('/users', async (req, res) => {
    var emailRegex = /(?:[a-z0-9!#$%&'*+\=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    var usernameRegex = /^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;
    // Var below will compare the user input with regex above to see if it is a valid email
    var compareEmail = req.body.email.match(emailRegex);
    var compareUsername = req.body.username.match(usernameRegex);

    if (!compareEmail && !compareUsername) {
        /* If email is invalid, a 400 error status code will be sent indicating 
            that the email format is invalid */
        return res.status(400).send({ reason: 'Email/username is using invalid characters' });
    } else {
        // Will go through the database to see if a user exists
        const userAccount = await checkUserEmail(req.body.email);

        if (userAccount !== undefined) {
            /* If an account under than email already exists, a 400 error status code
                will be sent along with a message telling the user that an account under
                that email exists.
            */
            return res.status(400).send({ reason: 'Account under that email already exists' });
        } else {
            /* If the email is not linked to any account, the password will be hashed
                using salt and the email and hashed password will be pushed to the users
                database. */
            try {
                // Hashes the password using bycrpt
                const hashedPassword = await bcrypt.hash(req.body.password, 10);

                // Pushing to the SQL database
                try {
                    const connection = await connect();
                    const newUser = new User();
                    newUser.id = Snowflake.generate();
                    newUser.password = hashedPassword;
                    newUser.email = req.body.email;
                    newUser.username = req.body.username;
                    await connection.manager.save(newUser);

                    await setupUser(req, newUser);

                    /* 
                        A 201 success status code will be sent along with a message 
                        telling the user that the account was successfully created.
                    */
                    res.status(201).json(classToPlain(newUser));
                } catch (err) {
                    console.log(err);
                }
            } catch {
                /* 
                In any odd event something goes wrong whilst the account is being 
                    created, a 500 status code will be sent.
                */
                res.status(500).send({ reason: 'Unknown Error' });
            }
        }
    }
})

router.patch('/users/:userID', authorization, async (req, res) => {
    if (req.body.username !== undefined) {
        var usernameRegex = /^(?=.{8,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/;

        // Var below will compare the user input with regex above to see if it is a valid username
        var compare = req.body.username.match(usernameRegex);

        if (!compare) {
            /* If username is invalid, a 400 error status code will be sent indicating 
                that the username format is invalid. */
            return res.status(400).send({ reason: 'Username is using invalid characters' });
        } else {
            // The user's input is then searched through the database to see if there is a match
            const userAccount = await checkUsername(req.body.username);

            /* If an account under than username already exists, a 400 error status code
                will be sent along with a message telling the user that an account under
                that username exists. */
            if (userAccount !== undefined) {
                return res.status(400).send({ reason: 'That username already exists' });
            } else {
                /* If the username is not linked to any account, the current username will be replaced
                    with the user's new chosen username which will be updated in database. */
                try {
                    // Establishes connection
                    const connection = await connect();

                    // Updating the SQL database
                    await connection
                        .createQueryBuilder()
                        .update(User)
                        .set({ username: req.body.username })
                        .where("id = :id", { id: req.params.userID })
                        .execute();

                    const session = encodeSession('CoronaChat', {
                        id: userAccount.user_id,
                        username: req.body.username
                    });

                    /* A 201 success status code will be sent along with a message 
                        telling the user that the account was successfully created. */
                    return res.status(201).send({ session, reason: 'Username changed successfully' });
                } catch (err) {
                    /* In any odd event something goes wrong whilst the account is being 
                        created, a 500 status code will be sent. */
                    res.status(500).send({ reason: 'Unknown Error' });
                }
            }
        }
    } else if (req.body.email !== undefined) {
        var emailRegex = /(?:[a-z0-9!#$%&'*+\=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

        // Var below will compare the user input with regex above to see if it is a valid email
        var compare = req.body.email.match(emailRegex);

        /* If email is invalid, a 400 error status code will be sent indicating 
            that the email format is invalid. */
        if (!compare) {
            return res.status(400).send({ reason: 'Email is using invalid characters' });
        } else {
            // The user's input is then searched through the database to see if there is a match
            const userAccount = await checkUserEmail(req.body.email);

            if (userAccount !== undefined) {
                /* If an account under than email already exists, a 400 error status code
                    will be sent along with a message telling the user that an account under
                    that email exists. */
                return res.status(400).send({ reason: 'That email already exists' });
            } else {
                /* If the email is not linked to any account, the current email will be replaced
                    with the user's new chosen email which will be updated in database. */
                try {
                    // Establishes connection
                    const connection = await connect();

                    // Updating the SQL database
                    await connection
                        .createQueryBuilder()
                        .update(User)
                        .set({ email: req.body.email })
                        .where("id = :id", { id: req.params.userID })
                        .execute();

                    /*A 201 success status code will be sent along with a message 
                        telling the user that the account was successfully created. */
                    return res.status(201).send({ reason: 'Email changed' });
                } catch (err) {
                    /* In any odd event something goes wrong whilst the account is being 
                        created, a 500 status code will be sent. */
                    res.status(500).send({ reason: 'Unknown Error' });
                }
            }
        }
    } else if (req.body.password !== undefined) {
        try {
            // Establishes connection
            const connection = await connect();

            // Updating the SQL database
            await connection
                .createQueryBuilder()
                .update(User)
                .set({ password: await bcrypt.hash(req.body.password, 10) })
                .where("id = :id", { id: req.params.userID })
                .execute();

            /* A 201 success status code will be sent along with a message 
                telling the user that the account was successfully created. */
            return res.status(201).send({ reason: 'Password changed' });
        } catch (err) {
            /* In any odd event something goes wrong whilst the account is being 
                created, a 500 status code will be sent. */
            res.status(500).send({ reason: 'Unknown Error' });
        }
    } else {
        res.status(500).send({ reason: 'Invalid body' });
    }
})

router.delete('/users/:userID', authorization, async (req, res) => {
    const server = await getRepository(Server).findOne({
        where: {
            owner: req.params.userID
        },
        relations: ['channels']
    }) as Server;
    const channels = server.channels
    channels.map(async a => await getRepository(Channel).remove(a));
    await getRepository(Server).remove(server);
    await getRepository(User).delete(req.params.userID);

    res.status(200).send({ ok: true, status: 200, message: 'User Deleted' })
})

// This following post request will login an existing user from the database
router.post('/users/login', async (req, res) => {
    // The user's input is then searched through the database to see if there is a match
    const userAccount = await checkUserEmail(req.body.email);

    /* If the account already exists, a 400 status code error will be sent along with 
        a message telling the user there is no account under that email. */
    if (userAccount == undefined) {
        /*
        If the account already exists, a 400 status code error will be sent along with 
            a message telling the user there is no account under that email.
        */
        return res.status(401).send({ reason: "No account exists for this email address" });
    } else {
        /* If the email exists in the database, the database hashed password
            will be compared with the password the user inputted. If the passwords match, a
            response will be sent telling the user that they have successfully logged in. */
        try {
            if (!await bcrypt.compare(req.body.password, userAccount.user_password)) {
                res.status(401).send({ reason: "Invalid password for this account" });
            } else {
                const session = encodeSession('CoronaChat', {
                    id: userAccount.user_id,
                    username: userAccount.user_username
                });
                console.log(session);
                res.status(200).send({ session });

            }
        } catch {
            /* In any odd event something goes wrong whilst the user is trying to
                log in, a 500 status code will be sent. */
            res.status(500).send();
        }
    }
});

// This is for the changeemail POST request to see if that email already exists on the system
async function checkUserEmail(emailInput: String): Promise<any> {
    try {
        // Establishes connection
        const connection = await connect();

        // SELECT search query to find if a user has the same email
        const emailQuery = await connection
            .createQueryBuilder()
            .select("user")
            .from(User, "user")
            .where("user.email = :email", { email: emailInput })
            .getRawOne();

        console.log(emailQuery);

        // Returns undefined if no match
        return emailQuery;
    } catch (err) {
        // Throws an error if something goes wrong during the process
        console.log(err);
    }
}

/* The checkUsername function searches through the database and checks if an account with 
    the username exists. It will return a user if it finds a match. Otherwise, it will
    return undefined. */
async function checkUsername(usernameInput: String): Promise<any> {
    try {
        // Establishes connection
        const connection = await connect();

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
        // Throws an error if something goes wrong during the process
        console.log(err);
    }
}

export default router;