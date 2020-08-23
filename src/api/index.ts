import * as express from 'express';
const bcrypt = require('bcrypt');

const app = express();

app.use(express.json());

const users: { email: any; password: any; }[] = [];

app.get('/users', (req, res) => {
    res.json(users);
});

// Register POST request
app.post('/users', async (req, res) => {
    /* The email regex variable will be compared with the
    email the user provides. The email will be considered valid
    based on certain conditions:
    - If there are no illegal characters
    - If */
    var emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    var compare = req.body.email.match(emailRegex);
    if (!compare) {
        return res.status(400).send('Email/username is using invalid characters');
    } else {
        const user = users.find(user => user.email === req.body.email);
        if (user != null) {
            return res.status(400).send('Account under that email/username already exists');
        } else {
            try {
                // var concat = req.body.email + req.body.password;
                const hashedPassword = await bcrypt.hash(req.body.password, 10);
                const user = { email: req.body.email, password: hashedPassword };
                users.push(user);
                res.status(201).send('Account created');
            } catch {
                res.status(500).send();
            }
        }
    }
});

// Login POST request
app.post('/users/login', async (req, res) => {
    const user = users.find(user => user.email === req.body.email);
    if (user == null) {
        return res.status(400).send('Account under this email/username does not exist');
    } else {
        try {
            // var concat = req.body.email + req.body.password;
            if (!await bcrypt.compare(req.body.password, user.password)) {
                res.send('Login failed');
            } else {
                res.send('Success');
            }
        } catch {
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