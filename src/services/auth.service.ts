import { SignJWT, jwtVerify } from "jose";

// Using a placeholder secret if one is not provided in env for local dev
const JWT_SECRET = process.env.JWT_SECRET || "ocean-aquarium-super-secret-key-123";
const key = new TextEncoder().encode(JWT_SECRET);

export class AuthService {
    /**
     * Signs a JWT payload and returns the token string
     */
    async signToken(payload: any): Promise<string> {
        const jwt = await new SignJWT(payload)
            .setProtectedHeader({ alg: "HS256" })
            .setIssuedAt()
            .setExpirationTime("7d") // Token expires in 7 days
            .sign(key);

        return jwt;
    }

    /**
     * Verifies a JWT token and returns the decoded payload
     */
    async verifyToken(token: string): Promise<any> {
        try {
            const { payload } = await jwtVerify(token, key);
            return payload;
        } catch (error) {
            return null;
        }
    }
}

export const authService = new AuthService();
