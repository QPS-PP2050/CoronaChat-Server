import fetch from 'node-fetch';
import { Agent } from 'https';
import { expect } from 'chai';;

import type { EncodeResult } from '../../src/utils/Types'

const date = new Date();
const seconds = date.getTime() / 10000000000;

const userDetails = {
	email: 'test@test.com',
	password: 'password123'
};

const updatedUsername = {
	username: `test${Math.round(seconds)}`
};

describe('Change Username API', () => {
    let session: EncodeResult;

    it('Should login, retrieve a session token and return 200', async () => {
        const res = await fetch('https://localhost:8080/api/users/login', {
            method: 'POST',
			body: JSON.stringify(userDetails),
			headers: { 'Content-type': 'application/json' },
			agent: new Agent({ rejectUnauthorized: false })
        });
        session = await res.json();
        expect(res.status).to.equal(200);
    })


	it('Should change an existing users username and return 201', async () => {
		// The ID in path will vary due to the snowflake algorithm
		const res = await fetch(`https://localhost:8080/api/users/${session.id}`, {
			method: 'PATCH',
			body: JSON.stringify(updatedUsername),
			headers: { 
                'Content-type': 'application/json',
                'Authorization': `Bearer ${session.token}`
            },
			agent: new Agent({ rejectUnauthorized: false })
		});
		expect(res.status).to.equal(201);
	});
});
