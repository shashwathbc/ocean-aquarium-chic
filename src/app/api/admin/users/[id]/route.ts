import { NextRequest } from "next/server";
import { userController } from "@/controllers/user.controller";
import dbConnect from "@/lib/db";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    await dbConnect();
    const resolvedParams = await params;
    return userController.updateAdminOrStaff(req, { params: resolvedParams });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    await dbConnect();
    const resolvedParams = await params;
    return userController.deleteAdminOrStaff(req, { params: resolvedParams });
}
