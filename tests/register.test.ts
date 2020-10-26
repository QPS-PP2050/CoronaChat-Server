import fetch from 'node-fetch';
import { Agent } from 'https';
import { expect } from 'chai';

const registrationDetails = {
	email: 'test@test.com',
	username: 'testuser',
	password: 'password123'
};

describe('Register API', () => {
	
	it('Should register a new user and return 201', async () => {
		const res = await fetch('https://8080-f7ed42e4-f722-4449-94c1-e2f12023b2af.ws-us02.gitpod.io/api/users', {
			method: 'POST',
			body: JSON.stringify(registrationDetails),
			headers: { 'Content-type': 'application/json' },
			agent: new Agent({ rejectUnauthorized: false })
		});
		expect(res.status).to.be(201);
		return res;
	});

	it('Should register a new user and return 400', async () => {
		const res = await fetch('https://8080-f7ed42e4-f722-4449-94c1-e2f12023b2af.ws-us02.gitpod.io/api/users', {
			method: 'POST',
			body: JSON.stringify(registrationDetails),
			headers: { 'Content-type': 'application/json' },
			agent: new Agent({ rejectUnauthorized: false })
		});
		expect(res.status).to.be(400);
		return res;
	});

});
