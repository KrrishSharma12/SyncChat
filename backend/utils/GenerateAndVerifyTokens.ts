import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const generateAccessToken = (userId: string, email: string): string => {
    const payload = { userId, email };
    const secretKey = process.env.JWT_SECRET
    const token =  jwt.sign(payload, secretKey!, { expiresIn: "15m" });
    return token;
}

export const verifyAccessToken = (token: string): { userId: string, email: string } | null => {
    try {
        const secretKey = process.env.JWT_SECRET
        const decoded = jwt.verify(token, secretKey!) as { userId: string, email: string };
        return decoded;
    } catch (error) {
        console.error("Token verification failed:", error);
        return null;
    }
}


export const generateRefreshToken = (userId: string, email: string): string => {
    const payload = { userId, email };
    const secretKey = process.env.JWT_SECRET;
    const token = jwt.sign(payload, secretKey!, { expiresIn: "7d" });
    return token;
}

export const verifyRefreshToken = (token: string): { userId: string, email: string } | null => {
    try {
        const secretKey = process.env.JWT_SECRET;
        const decoded = jwt.verify(token, secretKey!) as { userId: string, email: string };
        return decoded;
    } catch (error) {
        console.error("Refresh token verification failed:", error);
        return null;
    }
}