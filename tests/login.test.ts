import fetch from 'node-fetch';
import { Agent } from 'https';
import { expect } from 'chai';;

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
			agent: new Agent({ rejectUnauthorized: false })
		});
		expect(res.status).to.equal(200);
	});
});
