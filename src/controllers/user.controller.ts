import { NextRequest, NextResponse } from "next/server";
import { userRepository } from "@/repositories/user.repository";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { authService } from "@/services/auth.service";

export class UserController {
    private async checkIsAdmin(): Promise<boolean> {
        try {
            const cookieStore = await cookies();
            const token = cookieStore.get("auth-token")?.value;
            if (!token) return false;
            const user = await authService.verifyToken(token);
            return user?.role === "admin";
        } catch (error) {
            return false;
        }
    }
    async getAdminsAndStaff(request: NextRequest) {
        try {
            const users = await userRepository.findAdminsAndStaff();
            return NextResponse.json({ success: true, data: users });
        } catch (error: any) {
            console.error("Failed to fetch admin users:", error);
            return NextResponse.json(
                { success: false, error: "Failed to fetch users" },
                { status: 500 }
            );
        }
    }

    async createAdminOrStaff(request: NextRequest) {
        try {
            if (!(await this.checkIsAdmin())) {
                return NextResponse.json({ success: false, error: "Unauthorized: Admins only" }, { status: 403 });
            }

            const body = await request.json();
            const { name, email, password, role, number } = body;

            if (!name || !email || !password || !role) {
                return NextResponse.json(
                    { success: false, error: "Name, email, password, and role are required." },
                    { status: 400 }
                );
            }

            if (!['admin', 'staff'].includes(role)) {
                return NextResponse.json(
                    { success: false, error: "Invalid role assigned." },
                    { status: 400 }
                );
            }

            const existingUser = await userRepository.findByEmail(email);
            if (existingUser) {
                return NextResponse.json(
                    { success: false, error: "A user with this email already exists." },
                    { status: 409 }
                );
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const user = await userRepository.create({
                name,
                email,
                number,
                password: hashedPassword,
                role
            });

            return NextResponse.json({ success: true, data: user }, { status: 201 });
        } catch (error: any) {
            console.error("Failed to create admin user:", error);
            return NextResponse.json(
                { success: false, error: error.message || "Failed to create user" },
                { status: 500 }
            );
        }
    }

    async updateAdminOrStaff(request: NextRequest, { params }: { params: { id: string } }) {
        try {
            if (!(await this.checkIsAdmin())) {
                return NextResponse.json({ success: false, error: "Unauthorized: Admins only" }, { status: 403 });
            }

            const { id } = params;
            const body = await request.json();

            // Guard against changing passwords through this route for security reasons
            const { password, ...updateData } = body;

            const existingUser = await userRepository.findById(id);
            if (!existingUser) {
                return NextResponse.json(
                    { success: false, error: "User not found." },
                    { status: 404 }
                );
            }

            // Ensure we aren't creating collisions with email updates
            if (updateData.email && updateData.email !== existingUser.email) {
                const emailCheck = await userRepository.findByEmail(updateData.email);
                if (emailCheck) {
                    return NextResponse.json(
                        { success: false, error: "Email is already in use by another user." },
                        { status: 409 }
                    );
                }
            }

            const updatedUser = await userRepository.update(id, updateData);
            return NextResponse.json({ success: true, data: updatedUser });
        } catch (error: any) {
            console.error("Failed to update user:", error);
            return NextResponse.json(
                { success: false, error: error.message || "Failed to update user" },
                { status: 500 }
            );
        }
    }

    async deleteAdminOrStaff(request: NextRequest, { params }: { params: { id: string } }) {
        try {
            if (!(await this.checkIsAdmin())) {
                return NextResponse.json({ success: false, error: "Unauthorized: Admins only" }, { status: 403 });
            }

            const { id } = params;
            const user = await userRepository.findById(id);

            if (!user) {
                return NextResponse.json(
                    { success: false, error: "User not found." },
                    { status: 404 }
                );
            }

            await userRepository.delete(id);
            return NextResponse.json({ success: true, data: { _id: id } });
        } catch (error: any) {
            console.error("Failed to delete user:", error);
            return NextResponse.json(
                { success: false, error: error.message || "Failed to delete user" },
                { status: 500 }
            );
        }
    }
}

export const userController = new UserController();
