import fetch from 'node-fetch';
import https from 'https';
import expect from 'expect.js';

const date = new Date();
const seconds = date.getTime() / 10000000000;

const changeUserDetails = {
	username: `louismanabat${Math.round(seconds)}`
};

describe('Change Username API', () => {
	it('Should change an existing users username and return 201', async () => {
		// The ID in path will vary due to the snowflake algorithm
		const res = await fetch('https://localhost:8080/api/users/15754302186455040', {
			method: 'PATCH',
			body: JSON.stringify(changeUserDetails),
			headers: { 'Content-type': 'application/json' },
			agent: new https.Agent({ rejectUnauthorized: false })
		});
		expect(res.status).to.be(201);
	});
});
