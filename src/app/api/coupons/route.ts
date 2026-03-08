import { NextRequest } from "next/server";
import { couponController } from "@/controllers/coupon.controller";

export async function GET(req: NextRequest) {
    return couponController.getAllCoupons(req);
}

export async function POST(req: NextRequest) {
    return couponController.createCoupon(req);
}
