const fetch = require('node-fetch')
const https = require('https')
const expect = require('expect.js')

let registrationDetails = {
    "email": "louisM@gmail.com",
    "password": "passWord123"
}

describe('Register API', function() {
    it('Should register a new user and return 201', async function() {
        // Add delete user here

        const res = await fetch('https://localhost:8080/users', {
            method: 'POST',
            body: JSON.stringify(registrationDetailstion),
            headers: { 'Content-type': 'application/json' },
            agent: new https.Agent({ rejectUnauthorized: false})
        })
        expect(res.status).to.be(201);
        console.log(err);
    })
})