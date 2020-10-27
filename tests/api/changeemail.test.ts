import fetch from 'node-fetch';
import { Agent } from 'https';
import { expect } from 'chai';;

const date = new Date();
const seconds = Math.round(date.getTime() / 100);

const changeUserDetails = {
	email: `louismanabat${seconds}@gmail.com`
};

const loginDetails = {
	email: `louismanabat${seconds}@gmail.com`,
	password: 'louismanabat123'
};

describe('Change Email API', () => {
	it('Should change an existing users password and return 201', async () => {
		// The ID in path will vary due to the snowflake algorithm
		const res = await fetch('https://localhost:8080/api/users/15754302186455040', {
			method: 'PATCH',
			body: JSON.stringify(changeUserDetails),
			headers: { 'Content-type': 'application/json' },
			agent: new Agent({ rejectUnauthorized: false })
		});
		expect(res.status).to.equal(201);
	});

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
