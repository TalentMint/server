import { Response, NextFunction } from "express";
import { verifyToken } from "../utils/cryptoUtils";
import { AuthRequest } from "./types";

export const AuthMiddleware = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer "))
        return res
            .status(401)
            .json({ message: "Not authorized, token missing" });

    const token = authHeader.split(" ")[1];

    try {
        const decoded = verifyToken(token);
        req.user = decoded;
        next();
    } catch {
        res.status(401).json({ message: "Not authorized, token invalid" });
    }
};
