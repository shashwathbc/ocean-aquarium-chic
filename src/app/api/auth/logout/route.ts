import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
    try {
        const cookieStore = await cookies();
        // Destroys the authentication cookie
        cookieStore.delete("auth-token");

        return NextResponse.json({
            success: true,
            message: "Logged out successfully"
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: "Failed to log out" },
            { status: 500 }
        );
    }
}
