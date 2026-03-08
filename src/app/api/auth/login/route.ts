import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { userRepository } from "@/repositories/user.repository";
import { authService } from "@/services/auth.service";
import { cookies } from "next/headers";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { email, password } = body;

        if (!email || !password) {
            return NextResponse.json(
                { success: false, error: "Please provide email and password." },
                { status: 400 }
            );
        }

        // 1. Find the user (with password selected)
        const user = await userRepository.findByEmail(email);

        if (!user || !user.password) {
            return NextResponse.json(
                { success: false, error: "Invalid credentials." },
                { status: 401 }
            );
        }

        // 2. Verify password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return NextResponse.json(
                { success: false, error: "Invalid credentials." },
                { status: 401 }
            );
        }

        // 3. Create JWT Token
        const jwtPayload = {
            id: user._id,
            email: user.email,
            role: user.role,
            name: user.name
        };

        const token = await authService.signToken(jwtPayload);

        // 4. Set HttpOnly Cookie
        const cookieStore = await cookies();
        cookieStore.set("auth-token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 7 * 24 * 60 * 60, // 7 days
            path: "/",
        });

        return NextResponse.json({
            success: true,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error: any) {
        console.error("Login Error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to log in." },
            { status: 500 }
        );
    }
}
