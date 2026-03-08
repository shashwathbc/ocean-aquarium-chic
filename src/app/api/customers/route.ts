import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Customer from "@/models/Customer";

export async function GET(req: NextRequest) {
    try {
        await dbConnect();
        const customers = await Customer.find()
            .sort({ totalSpent: -1 }) // Sort by highest LTV first
            .lean();

        return NextResponse.json({ success: true, data: customers }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json(
            { success: false, error: error.message || "Failed to fetch customers" },
            { status: 500 }
        );
    }
}
