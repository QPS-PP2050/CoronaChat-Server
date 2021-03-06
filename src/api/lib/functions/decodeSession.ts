import { decode, TAlgorithm } from 'jwt-simple';
import type { DecodeResult, Session } from '@utils/Types';

export function decodeSession(secretKey: string, tokenString: string): DecodeResult {
	// Always use HS512 to decode the token
	const algorithm: TAlgorithm = 'HS512';

	try {
		const result: Session = decode(tokenString, secretKey, false, algorithm);

		return {
			type: 'valid',
			session: result
		};
	} catch (_e) {
		const e: Error = _e;

		// These error strings can be found here:
		// https://github.com/hokaccha/node-jwt-simple/blob/c58bfe5e5bb049015fcd55be5fc1b2d5c652dbcd/lib/jwt.js
		if (e.message === 'No token supplied' || e.message === 'Not enough or too many segments') {
			return {
				type: 'invalid-token'
			};
		}

		if (e.message === 'Signature verification failed' || e.message === 'Algorithm not supported') {
			return {
				type: 'integrity-error'
			};
		}

		// Handle json parse errors, thrown when the payload is nonsense
		if (e.message.startsWith('Unexpected token')) {
			return {
				type: 'invalid-token'
			};
		}

		throw e;
	}
}
