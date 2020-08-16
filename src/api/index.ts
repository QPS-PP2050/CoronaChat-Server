import * as express from 'express';
const bcrypt = require('bcrypt');

const app = express();

app.use(express.json());

const users = [{}];

app.get('/users', (req, res) => {
    res.json(users)
});

app.post('/users', async (req, res) => {
    try {
        var combine = req.body.email + req.body.password;
        const hashedPassword = await bcrypt.hash(combine, 10);
        const user = { name: req.body.email, password: hashedPassword };
        users.push(user);
        res.status(201).send();
    } catch {
        res.status(500).send();
    }
    
    
});

app.listen(3000);