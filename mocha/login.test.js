const fetch = require('node-fetch')
const https = require('https')
const expect = require('expect.js')

let loginDetails = {
    "email": "louisM@gmail.com",
    "password": "passWord123"
}

describe('Login API', function() {
    it('Should login an existing user and return 201', async function() {
        const res = await fetch('https://localhost:8080/api/users/login', {
            method: 'POST',
            body: JSON.stringify(loginDetails),
            headers: { 'Content-type': 'application/json' },
            agent: new https.Agent({ rejectUnauthorized: false})
        })
        expect(res.status).to.be(201);
        done();
    })
})