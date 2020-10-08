const fetch = require('node-fetch')
const https = require('https')
const expect = require('expect.js')

let changeUserDetails = {
    "id": 13193204077821952,
    "password": "louismanabat123"
}

describe('Login API', function() {
    it('Should change an existing users password and return 201', async function() {
        const res = await fetch('https://localhost:8080/api/users/changepassword', {
            method: 'POST',
            body: JSON.stringify(changeUserDetails),
            headers: { 'Content-type': 'application/json' },
            agent: new https.Agent({ rejectUnauthorized: false})
        })
        expect(res.status).to.be(201);
        done();
    })
})