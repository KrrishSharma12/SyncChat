
import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/GenerateAndVerifyTokens";

interface TokenPayload {
    userId: string;
    email: string;
}

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
            };
        }
    }
}

export const authMiddleware = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.cookies.accessToken;

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized. Please login.",
            });
        }

        const decoded = verifyAccessToken(token) as TokenPayload | null;

        if (!decoded) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token.",
            });
        }

        req.user = {
            id: decoded.userId,
            email: decoded.email,
        };

        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired token.",
        });
    }
};