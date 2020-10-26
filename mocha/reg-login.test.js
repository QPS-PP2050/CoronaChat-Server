const fetch = require('node-fetch')
const https = require('https')
const expect = require('expect.js')

var date = new Date();
var seconds = Math.round(date.getTime() / 1000);

let details = {
    "email": `louismanabat${seconds}@gmail.com`,
    "password": "passWord123"
}

describe('Register/Login API', function () {
    it('Should register a new user and return 201', async function () {
        const res = await fetch('https://localhost:8080/api/users', {
            method: 'POST',
            body: JSON.stringify(details),
            headers: { 'Content-type': 'application/json' },
            agent: new https.Agent({ rejectUnauthorized: false })
        })
        expect(res.status).to.be(201);
    })

    it('Should login an existing user and return 201', async function() {
        const res = await fetch('https://localhost:8080/api/users/login', {
            method: 'POST',
            body: JSON.stringify(details),
            headers: { 'Content-type': 'application/json' },
            agent: new https.Agent({ rejectUnauthorized: false})
        })
        expect(res.status).to.be(200);
    })
})