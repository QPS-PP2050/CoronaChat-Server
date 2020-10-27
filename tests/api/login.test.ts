import fetch from 'node-fetch';
import { Agent } from 'https';
import { expect } from 'chai';;

const userDetails = {
	email: 'test@test.com',
	password: 'password123'
};

const fakeUserDetails = {
	email: 'fail@test.com',
	password: 'fail123'
};

describe('Login API', () => {
	it('Should login an existing user and return 201', async () => {
		const res = await fetch('https://localhost:8080/api/users/login', {
			method: 'POST',
			body: JSON.stringify(userDetails),
			headers: { 'Content-type': 'application/json' },
			agent: new Agent({ rejectUnauthorized: false })
		});
		expect(res.status).to.equal(200);
    });
    
    it('Should fail to login and return 401', async () => {
		const res = await fetch('https://localhost:8080/api/users/login', {
			method: 'POST',
			body: JSON.stringify(fakeUserDetails),
			headers: { 'Content-type': 'application/json' },
			agent: new Agent({ rejectUnauthorized: false })
		});
		expect(res.status).to.equal(401);
	});
});
