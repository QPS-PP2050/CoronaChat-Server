import fetch from 'node-fetch';
import { Agent } from 'https';
import { expect } from 'chai';;

import type { EncodeResult } from '../../src/utils/Types'

const date = new Date();
const seconds = Math.round(date.getTime() / 100);

const userDetails = {
    email: 'test@test.com',
    password: 'password123'
};

const changeUserDetails = {
    email: `test${seconds}@test.com`
};

let session: EncodeResult;

describe('Change Email API', () => {

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
        expect(res.status).to.equal(201);
    });

});
