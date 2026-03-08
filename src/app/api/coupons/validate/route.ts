import { NextRequest } from "next/server";
import { couponController } from "@/controllers/coupon.controller";

export async function POST(req: NextRequest) {
    return couponController.validateCoupon(req);
}
