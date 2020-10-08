const fetch = require('node-fetch')
const https = require('https')
const expect = require('expect.js')

var date = new Date();
var seconds = Math.round(d.getTime() / 1000);

let changeUserDetails = {
    "id": 13193204077821952,
    "email": `louismanabat${seconds}@gmail.com`
}

describe('Login API', function() {
    it('Should change an existing users password and return 201', async function() {
        const res = await fetch('https://localhost:8080/users/changeemail', {
            method: 'POST',
            body: JSON.stringify(changeUserDetails),
            headers: { 'Content-type': 'application/json' },
            agent: new https.Agent({ rejectUnauthorized: false})
        })
        expect(res.status).to.be(201);
        console.log(err);
    })
})