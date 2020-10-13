import { decodeSession } from "@api/lib/functions";

import type { Socket } from "socket.io";
import type { NextFunction } from "express";
import type { DecodeResult, Session } from "@utils/Types";

export function wsAuthorization(socket: Socket, next: NextFunction) {
    const secretKey = 'CoronaChat'
    const requestHeader = "authorization";

    let sessionToken = socket.request.headers[requestHeader];
    if (!sessionToken) {
        return `Required ${requestHeader} header not found.`;

    }
    
    if (!sessionToken.startsWith('Bearer')) {
        return 'Invalid authorization type provided.';
        
    }
    sessionToken = sessionToken.split(' ')[1];

    const decodedSession: DecodeResult = decodeSession(secretKey, sessionToken);
    
    if (decodedSession.type === "integrity-error" || decodedSession.type === "invalid-token") {
        return `Failed to decode or validate authorization token. Reason: ${decodedSession.type}.`;
        
    }

    const session: Session = decodedSession.session;
    socket.session = session;

    next();
}