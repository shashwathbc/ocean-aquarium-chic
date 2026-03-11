import { NextRequest } from "next/server";
import { userController } from "@/controllers/user.controller";
import dbConnect from "@/lib/db";

export async function GET(req: NextRequest) {
    await dbConnect();
    return userController.getAdminsAndStaff(req);
}

export async function POST(req: NextRequest) {
    await dbConnect();
    return userController.createAdminOrStaff(req);
}
