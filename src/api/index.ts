import * as express from 'express';
const bcrypt = require('bcrypt');

const app = express(); 

/* The following code is to work with creating a localised database
and creating a register and login feature that uses salt from bcrypt
to hash passwords to increased security.

To access the database, please visit this branch to see the online
database that uses PostgresSQl
*Link here* 

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

app.use(express.json()); // The application will accept a json format

const users: { email: any; password: any; }[] = []; // Users database

// A test method to see if the register/login methods work
app.get('/users', (req, res) => {
    res.json(users);
});

// The following method is to register a new user to a local database
app.post('/users', async (req, res) => {
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
    if (!compare) {
        /* If email is invalid, a 400 error status code will be sent indicating 
            that the email format is invalid */
        return res.status(400).send('Email/username is using invalid characters');
    } else {
        // The user's input is then searched through the local databsse to see if there is a match
        const user = users.find(user => user.email === req.body.email);
        if (user != null) {
            /* If an account under than email already exists, a 400 error status code
                will be sent along with a message telling the user that an account under
                that email exists */
            return res.status(400).send('Account under that email/username already exists');
        } else {
            /* If the email is not linked to any account, the password will be hashed
                using salt and the email and hashed password will be pushed to the users
                database */
            try {
                // var concat = req.body.email + req.body.password;
                const hashedPassword = await bcrypt.hash(req.body.password, 10);
                const user = { email: req.body.email, password: hashedPassword };
                users.push(user);
                /* A 201 success status code will be sent along with a message 
                    telling the user that the account was successfully created */
                res.status(201).send('Account created');
            } catch {
                /* In any odd event something goes wrong whilst the account is being 
                    created, a 500 status code will be sent */
                res.status(500).send();
            }
        }
    }
});

// The following method is to login a user by seeing if a certain account exists in the database
app.post('/users/login', async (req, res) => {
    // The user's input is then searched through the local databsse to see if there is a match
    const user = users.find(user => user.email === req.body.email);
    if (user == null) {
        /* If the account already exists, a 400 status code error will be sent
            along with a message telling the user there is no account under that email */
        return res.status(400).send('Account under this email/username does not exist');
    } else {
        /* If the email exists in the local database, the local database hashed password
            will be compared with the password the user inputted. If the passwords match, a
            response will be sent telling the user that they have successfully logged in */
        try {
            // var concat = req.body.email + req.body.password;
            if (!await bcrypt.compare(req.body.password, user.password)) {
                res.send('Login failed');
            } else {
                res.send('Success');
            }
        } catch {
            /* In any odd event something goes wrong whilst the user is trying to
                log in, a 500 status code will be sent */
            res.status(500).send();
        }
    }
});


// Trying to make POST functions a bit cleaner by adding a modular function...
// Didn't work but will keep it here if can figure out how to fix it
// function checkEmail(email: any) {
//     app.post('/users', async (req, res) => {
//         const user = users.find(user => user.email === email);
//         if (user != null)
//             return false;
//         else
//             return true;
//     });
// };

app.listen(3000);

