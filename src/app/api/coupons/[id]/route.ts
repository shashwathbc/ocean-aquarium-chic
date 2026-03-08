import { NextRequest } from "next/server";
import { couponController } from "@/controllers/coupon.controller";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    return couponController.updateCoupon(req, { params: resolvedParams });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    return couponController.deleteCoupon(req, { params: resolvedParams });
}
