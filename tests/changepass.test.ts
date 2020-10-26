import fetch from 'node-fetch';
import https from 'https';
import expect from 'expect.js';

const changeUserDetails = {
	password: 'louismanabat123'
};

describe('Change Password API', () => {
	it('Should change an existing users password and return 201', async () => {
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
