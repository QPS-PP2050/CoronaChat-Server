import { encode, TAlgorithm } from 'jwt-simple';
import type { PartialSession, EncodeResult, Session } from '@utils/Types';

export function encodeSession(secretKey: string, partialSession: PartialSession): EncodeResult {
	// Always use HS512 to sign the token
	const algorithm: TAlgorithm = 'HS512';
	// Determine when the token should expire
	const issued = Date.now();
	const fifteenMinutesInMs = 15 * 60 * 1000;
	const expires = issued + fifteenMinutesInMs;
	const session: Session = {
		...partialSession,
		issued,
		expires
	};

	return {
		token: encode(session, secretKey, algorithm),
		id: partialSession.id,
		username: partialSession.username,
		issued,
		expires
	};
}
