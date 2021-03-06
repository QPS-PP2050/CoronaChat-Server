import fetch from 'node-fetch';
import { Agent } from 'https';
import { expect } from 'chai';

const userDetails = {
	email: `test@test.com`,
	username: `testuser`,
	password: 'password123'
};

const fakeUserDetails = {
	email: 'fail@test.com',
	password: 'fail123'
};

describe('Register/Login API', () => {
	
	it('Should register a new user and return 202', async () => {
		const res = await fetch('https://localhost:8080/api/users', {
			method: 'POST',
			body: JSON.stringify(userDetails),
			headers: { 'Content-type': 'application/json' },
			agent: new Agent({ rejectUnauthorized: false })
		});
		return expect(res.status, `Fail (${res.status}): ${(await res.json()).reason}`).to.equal(202);
	});

	it('Should fail to register a new user and return 400', async () => {
		const res = await fetch('https://localhost:8080/api/users', {
			method: 'POST',
			body: JSON.stringify(userDetails),
			headers: { 'Content-type': 'application/json' },
			agent: new Agent({ rejectUnauthorized: false })
		});
		return expect(res.status, `Fail (${res.status}): ${(await res.json()).reason}`).to.equal(400);
	});


	it('Should login an existing user and return 201', async () => {
		const res = await fetch('https://localhost:8080/api/users/login', {
			method: 'POST',
			body: JSON.stringify(userDetails),
			headers: { 'Content-type': 'application/json' },
			agent: new Agent({ rejectUnauthorized: false })
		});
		expect(res.status, `Fail (${res.status}): ${(await res.json()).reason}`).to.equal(200);
    });
    
    it('Should fail to login and return 401', async () => {
		const res = await fetch('https://localhost:8080/api/users/login', {
			method: 'POST',
			body: JSON.stringify(fakeUserDetails),
			headers: { 'Content-type': 'application/json' },
			agent: new Agent({ rejectUnauthorized: false })
		});
		expect(res.status, `Fail (${res.status}): ${(await res.json()).reason}`).to.equal(401);
	});
});
