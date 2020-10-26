import fetch from 'node-fetch';
import https from 'https';
import expect from 'expect.js';

const registrationDetails = {
	email: 'louisM2@gmail.com',
	password: 'passWord123'
};

describe('Register API', () => {
	it('Should register a new user and return 201', async () => {
		const res = await fetch('https://localhost:8080/api/users', {
			method: 'POST',
			body: JSON.stringify(registrationDetails),
			headers: { 'Content-type': 'application/json' },
			agent: new https.Agent({ rejectUnauthorized: false })
		});
		expect(res.status).to.be(201);
	});
});
