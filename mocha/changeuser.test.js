const fetch = require('node-fetch')
const https = require('https')
const expect = require('expect.js')

var date = new Date();
var seconds = date.getTime() / 10000000000;

let changeUserDetails = {
    "id": 13193204077821952,
    "username": "louismanabat" + Math.round(seconds)
}

describe('Change Username API', function() {
    it('Should change an existing users username and return 201', async function() {
        const res = await fetch('https://localhost:8080/api/users/changeusername', {
            method: 'POST',
            body: JSON.stringify(changeUserDetails),
            headers: { 'Content-type': 'application/json' },
            agent: new https.Agent({ rejectUnauthorized: false})
        })
        expect(res.status).to.be(201);
    })
})