import fetch from 'node-fetch';
import { Agent } from 'https';
import { expect } from 'chai';;

import type { EncodeResult } from '../../src/utils/Types'

const userDetails = {
	email: 'test@test.com',
	password: 'password123'
};

const changeUserDetails = {
	password: 'password123'
};

let session: EncodeResult;

describe('Change Password API', () => {

    before(async () => {
        const res = await fetch('https://localhost:8080/api/users/login', {
            method: 'POST',
            body: JSON.stringify(userDetails),
            headers: { 'Content-type': 'application/json' },
            agent: new Agent({ rejectUnauthorized: false })
        });
        const result = await res.json();
        session = result.session;
    })

	it('Should change an existing users password and return 201', async () => {
		// The ID in path will vary due to the snowflake algorithm
		const res = await fetch(`https://localhost:8080/api/users/${session.id}`, {
			method: 'PATCH',
			body: JSON.stringify(changeUserDetails),
			headers: { 
                'Content-type': 'application/json',
                'Authorization': `Bearer ${session.token}`
            },
			agent: new Agent({ rejectUnauthorized: false })
		});
		expect(res.status, `Fail (${res.status}): ${(await res.json()).reason}`).to.equal(201);
	});
});
