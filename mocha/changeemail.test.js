const fetch = require('node-fetch')
const https = require('https')
const expect = require('expect.js')

var date = new Date();
seconds = Math.round(date.getTime() / 100);

let changeUserDetails = {
    "email": `louismanabat${seconds}@gmail.com`
}

let loginDetails = {
    "email": `louismanabat${seconds}@gmail.com`,
    "password": "louismanabat123"
}

describe('Change Email API', function() {
    it('Should change an existing users password and return 201', async function() {
        // The ID in path will vary due to the snowflake algorithm
        const res = await fetch('https://localhost:8080/api/users/15754302186455040', {
            method: 'PATCH',
            body: JSON.stringify(changeUserDetails),
            headers: { 'Content-type': 'application/json' },
            agent: new https.Agent({ rejectUnauthorized: false})
        })
        expect(res.status).to.be(201);
    })

    it('Should login an existing user and return 201', async function() {
        const res = await fetch('https://localhost:8080/api/users/login', {
            method: 'POST',
            body: JSON.stringify(loginDetails),
            headers: { 'Content-type': 'application/json' },
            agent: new https.Agent({ rejectUnauthorized: false})
        })
        expect(res.status).to.be(200);
    })
})