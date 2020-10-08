import { encodeSession, decodeSession, checkExpiration } from '../functions'
import type { Session, DecodeResult, ExpirationStatus } from '../types'

import type { Request, Response, NextFunction } from "express";

/**
 * Express middleware, checks for a valid JSON Web Token and returns 401 Unauthorized if one isn't found.
 */
export function authorization(request: Request, response: Response, next: NextFunction) {
    const unauthorized = (message: string) => response.status(401).json({
        ok: false,
        status: 401,
        message: message
    });

    const secretKey = 'CoronaChat'
    const requestHeader = "Authorization";
    const responseHeader = "X-Refresh-Token"
    let header = request.header(requestHeader);
    
    if (!header) {
        unauthorized(`Required ${requestHeader} header not found.`);
        return;
    }

    if (!header.startsWith('Bearer')) {
        unauthorized('Invalid authorization type provided.')
        return;
    }

    header = header.split(' ')[1];

    const decodedSession: DecodeResult = decodeSession(secretKey, header);
    
    if (decodedSession.type === "integrity-error" || decodedSession.type === "invalid-token") {
        unauthorized(`Failed to decode or validate authorization token. Reason: ${decodedSession.type}.`);
        return;
    }

    const expiration: ExpirationStatus = checkExpiration(decodedSession.session);

    if (expiration === "expired") {
        unauthorized(`Authorization token has expired. Please create a new authorization token.`);
        return;
    }

    let session: Session;

    if (expiration === "grace") {
        // Automatically renew the session and send it back with the response
        const { token, expires, issued } = encodeSession(secretKey, decodedSession.session);
        session = {
            ...decodedSession.session,
            expires: expires,
            issued: issued
        };

        response.setHeader(responseHeader, token);
    } else {
        session = decodedSession.session;
    }

    // Set the session on response.locals object for routes to access
    response.locals = {
        ...response.locals,
        session: session
    };

    // Request has a valid or renewed session. Call next to continue to the authenticated route handler
    next();
}