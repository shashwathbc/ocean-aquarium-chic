import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { userRepository } from "@/repositories/user.repository";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, password } = body;

        if (!name || !email || !password) {
            return NextResponse.json(
                { success: false, error: "Please provide name, email and password." },
                { status: 400 }
            );
        }

        // 1. Check if user already exists
        const existingUser = await userRepository.findByEmail(email);
        if (existingUser) {
            return NextResponse.json(
                { success: false, error: "User already exists with that email." },
                { status: 409 }
            );
        }

        // 2. Hash the password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Create the user
        const user = await userRepository.create({
            name,
            email,
            password: hashedPassword,
            role: 'user', // Default role for new signups
        });

        // We don't return the JWT or the password back right away. 
        // Usually, they log in immediately afterward, or we could sign a token here.
        return NextResponse.json({
            success: true,
            message: "Registration successful. Please log in.",
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        }, { status: 201 });

    } catch (error: any) {
        console.error("Registration Error:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Failed to register user." },
            { status: 500 }
        );
    }
}
