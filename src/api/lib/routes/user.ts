import * as bcrypt from 'bcrypt';
import { Router } from 'express';
import { encodeSession } from '../functions';
import { authorization } from '../middleware/authorization';
import { connect } from '@orm/dbConfig';
import { User } from '@orm/entities/User';
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
    /*  The email regex variable will be compared with the
        email the user provides. The email will be considered valid
        based on certain conditions:
        - If there are no illegal characters (only dash and underscore allowed)
        - If the beginning character is alphanumeric
        - An '@' is present and does not have a dot before or after it
        - No consecutive dots */
    var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    // Var below will compare the user input with regex above to see if it is a valid email
    var compare = req.body.email.match(emailRegex);

    if (!compare) {
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

router.delete('/users/:userId', authorization, async (req, res) => {
    await getRepository(User).delete(req.params.userId);

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

// This post request will change a user's username (assuming it doesn't already exist)
router.post('/users/changeusername', async (req, res) => {
    /*  The username regex variable will be compared with the username
        the user provides. The username will be considered valid
        based on certain conditions:
        - If there are no illegal characters 
        - If the beginning character is a letter
        - Only contains lowercase letters and numbers between 0 to 9
        - Is between 8 to 16 characters */
    var usernameRegex = /^\D[a-z0-9]{8,16}$/;
    // Var below will compare the user input with regex above to see if it is a valid username
    var compare = req.body.username.match(usernameRegex);

    // Checks if a user with a certain ID exists
    const userAccount = await accountcheck(req.body.id);

    /* If the account does not exists, a 400 status code error will be sent along with 
        a message telling the user there is no account under that ID. */
    if (userAccount == undefined) {
        return res.status(400).send('Account with that User ID does not exist');
    } else {
        if (!compare) {
            /* If username is invalid, a 400 error status code will be sent indicating 
                that the username format is invalid. */
            return res.status(400).send('Username is using invalid characters');
        } else {
            // The user's input is then searched through the database to see if there is a match
            const userAccount = await checkUsername(req.body.username);

            /* If an account under than username already exists, a 400 error status code
                will be sent along with a message telling the user that an account under
                that username exists. */
            if (userAccount !== undefined) {
                return res.status(400).send('That username already exists');
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
                        .where("id = :id", { id: req.body.id })
                        .execute();

                    /* A 201 success status code will be sent along with a message 
                        telling the user that the account was successfully created. */
                    return res.status(201).send("Username changed");
                } catch (err) {
                    /* In any odd event something goes wrong whilst the account is being 
                        created, a 500 status code will be sent. */
                    res.status(500).send();
                }
            }
        }
    }
})

// This post request will change a user's password 
router.post('/users/changepassword', async (req, res) => {
    // Checks if a user with a certain ID exists
    const userAccount = await accountcheck(req.body.id);

    /* If the account does not exists, a 400 status code error will be sent along with 
        a message telling the user there is no account under that ID. */
    if (userAccount == undefined) {
        return res.status(400).send('Account with that User ID does not exist');
    } else {
        try {
            // Establishes connection
            const connection = await connect();

            // Updating the SQL database
            await connection
                .createQueryBuilder()
                .update(User)
                .set({ password: await bcrypt.hash(req.body.password, 10) })
                .where("id = :id", { id: req.body.id })
                .execute();

            /* A 201 success status code will be sent along with a message 
                telling the user that the account was successfully created. */
            return res.status(201).send("Password changed");
        } catch (err) {
            /* In any odd event something goes wrong whilst the account is being 
                created, a 500 status code will be sent. */
            res.status(500).send();
        }
    }
})

// This post request will change a user's email (assuming it doesn't already exist)
router.post('/user/changeemail', async (req, res) => {
    /* The email regex variable will be compared with the
        email the user provides. The email will be considered valid
        based on certain conditions:
        - If there are no illegal characters (only dash and underscore allowed)
        - If the beginning character is alphanumeric
        - An '@' is present and does not have a dot before or after it
        - No consecutive dots */
    var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    // Var below will compare the user input with regex above to see if it is a valid email
    var compare = req.body.email.match(emailRegex);

    // Checks if a user with a certain ID exists
    const userAccount = await accountcheck(req.body.id);

    /* If the account does not exists, a 400 status code error will be sent along with 
        a message telling the user there is no account under that ID. */
    if (userAccount == undefined) {
        return res.status(400).send('Account with that User ID does not exist');
    } else {
        /* If email is invalid, a 400 error status code will be sent indicating 
            that the email format is invalid. */
        if (!compare) {
            return res.status(400).send('Email is using invalid characters');
        } else {
            // The user's input is then searched through the database to see if there is a match
            const userAccount = await checkUserEmail(req.body.email);

            if (userAccount !== undefined) {
                /* If an account under than email already exists, a 400 error status code
                    will be sent along with a message telling the user that an account under
                    that email exists. */
                return res.status(400).send('That email already exists');
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
                        .where("id = :id", { id: req.body.id })
                        .execute();

                    /*A 201 success status code will be sent along with a message 
                        telling the user that the account was successfully created. */
                    return res.status(201).send("Email changed");
                } catch (err) {
                    /* In any odd event something goes wrong whilst the account is being 
                        created, a 500 status code will be sent. */
                    res.status(500).send();
                }
            }
        }
    }
})

// This delete request will complete delete and remove the user from the database
router.delete('/users/:userID', async (req, res) => {
    // Checks if a user with a certain ID exists
    const userAccount = await accountcheck(req.body.id);

    /* If the account does not exists, a 400 status code error will be sent along with 
        a message telling the user there is no account under that ID. */
    if (userAccount == undefined) {
        return res.status(400).send('Account with that User ID does not exist');
    } else {
        try {
            // Establishes connection
            const connection = await connect();

            // Updating the SQL database
            await connection
                .createQueryBuilder()
                .delete()
                .from(User)
                .where("user.id = :id", { id: req.params.userID })
                .execute();
        } catch (err) {
            /* In any odd event something goes wrong whilst the account is being 
                created, a 500 status code will be sent. */
            res.status(500).send();
        }
    }
})

// The function checks if there is a user with a certain ID that exists in the database
async function accountcheck(userID: number): Promise<any> {
    try {
        // Establishes connection
        const connection = await connect();

        // SELECT search query to find if an account under the user ID exists
        const accountQuery = await connection
            .createQueryBuilder()
            .select("user")
            .from(User, "user")
            .where("user.id = :id", { id: userID })
            .getRawOne();

        // Returns undefined if no match
        return accountQuery;
    } catch (err) {
        // Throws an error if something goes wrong during the process
        console.log(err);
    }
}

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