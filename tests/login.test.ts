import fetch from 'node-fetch';
import https from 'https';
import expect from 'expect.js';

const loginDetails = {
	email: 'louisM2@gmail.com',
	password: 'louismanabat123'
};

describe('Login API', () => {
	it('Should login an existing user and return 201', async () => {
		const res = await fetch('https://localhost:8080/api/users/login', {
			method: 'POST',
			body: JSON.stringify(loginDetails),
			headers: { 'Content-type': 'application/json' },
			agent: new https.Agent({ rejectUnauthorized: false })
		});
		expect(res.status).to.be(200);
	});
});
