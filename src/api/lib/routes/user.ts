import * as bcrypt from 'bcrypt';
import { Router } from 'express';
import { encodeSession } from '../functions';
import { connect } from './../../../orm/dbConfig';
import { User } from './../../../orm/entities/User';
import * as Snowflake from './../../../utils/Snowflake';



const router = Router();

router.get('/users', async (req, res) => {
    try {
        const connection = await connect();
        const users = await connection.manager.find(User);
        console.log(users);

        res.json(users);
    } catch (err) {
        console.log(err);

    }
})

router.post('/users/register', async (req, res) => {

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
        return res.status(400).send({ reason: 'Email/username is using invalid characters' });
    } else {
        // Will go through the database to see if a user exists
        const userAccount = await checkUserEmail(req.body.email);

        if (userAccount !== undefined) {
            /* 
            If an account under than email already exists, a 400 error status code
                will be sent along with a message telling the user that an account under
                that email exists.
            */
            return res.status(400).send({ reason: 'Account under that email already exists' });
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
                    newUser.id = Snowflake.generate();
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
                res.status(201).send({ reason: 'Account created' });
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

router.post('/users/login', async (req, res) => {
    // The user's input is then searched through the database to see if there is a match
    const userAccount = await checkUserEmail(req.body.email);

    if (userAccount == undefined) {
        /*
        If the account already exists, a 400 status code error will be sent along with 
            a message telling the user there is no account under that email.
        */
        return res.status(401).send({ reason: "No account exists for this email address" });
    } else {
        /* 
        If the email exists in the database, the database hashed password
            will be compared with the password the user inputted. If the passwords match, a
            response will be sent telling the user that they have successfully logged in.
        */
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
            /* 
            In any odd event something goes wrong whilst the user is trying to
                log in, a 500 status code will be sent.
            */
            res.status(500).send();
        }
    }
})

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

        console.log(emailQuery);

        // Returns undefined if no match
        return emailQuery;
    } catch (err) {
        console.log(err);
    }
}

export default router;