import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { appConfig } from "../../config";

export function generateNonce(
    ephemeralPublicKey: string,
    maxEpoch: number
): string {
    return `zklogin-${ephemeralPublicKey}-${maxEpoch}-${Date.now()}`;
}

export function deriveSalt(provider: string, providerUserId: string): string {
    return crypto
        .createHmac("sha256", process.env.SALT_SECRET!)
        .update(`${provider}:${providerUserId}`)
        .digest("hex");
}

interface JwtPayload {
    [key: string]: any;
}

export const generateJwt = (
    payload: JwtPayload,
    expiresIn?: number
): string => {
    return jwt.sign(payload, appConfig.jwtSecret, {
        expiresIn: expiresIn ?? "1d",
    });
};
export const verifyToken = (token: string) => {
    return jwt.verify(token, appConfig.jwtSecret);
};

export const hash = (str: string): Promise<string> => bcrypt.hash(str, 2);
export const compare = (str: string, token: string): Promise<boolean> =>
    bcrypt.compare(str, token);
