import { jwtVerify, createRemoteJWKSet } from "jose";

const GOOGLE_ISSUER = "https://accounts.google.com";
const GOOGLE_JWKS_URI = "https://www.googleapis.com/oauth2/v3/certs";

const APPLE_ISSUER = "https://appleid.apple.com";
const APPLE_JWKS_URI = "https://appleid.apple.com/auth/keys";


export const validateGoogleIdToken = async (
    idToken: string,
    expectedAudience: string
) => {
    const jwks = createRemoteJWKSet(new URL(GOOGLE_JWKS_URI));
    
    try {
        const { payload } = await jwtVerify(idToken, jwks, {
            issuer: GOOGLE_ISSUER,
            audience: expectedAudience,
        });
        if (!payload.sub) {
            throw new Error("Missing subject claim");
        }
        return {
            sub: payload.sub,
            email: payload.email,
            emailVerified: payload.email_verified,
        };
    } catch (err) {
        throw new Error(`Invalid Google ID token: ${(err as Error).message}`);
    }
};

export const validateAppleIdToken = async (
    idToken: string,
    expectedAudience: string
) => {
    const jwks = createRemoteJWKSet(new URL(APPLE_JWKS_URI));
    try {
        const { payload } = await jwtVerify(idToken, jwks, {
            issuer: APPLE_ISSUER,
            audience: expectedAudience,
        });

        if (!payload.sub) {
            throw new Error("Missing subject claim");
        }

        return {
            sub: payload.sub,
            email: payload.email,
            emailVerified: payload.email_verified,
        };
    } catch (err) {
        throw new Error(`Invalid Apple ID token: ${(err as Error).message}`);
    }
};
