import { NextRequest, NextResponse } from "next/server";
import { couponService } from "@/services/coupon.service";

export class CouponController {
    async createCoupon(req: NextRequest) {
        try {
            const body = await req.json();
            const newCoupon = await couponService.createCoupon(body);
            return NextResponse.json({ success: true, data: newCoupon }, { status: 201 });
        } catch (error: any) {
            if (error.name === "ValidationError") {
                return NextResponse.json(
                    { success: false, errors: error.errors },
                    { status: 400 }
                );
            }
            return NextResponse.json(
                { success: false, error: error.message || "Failed to create coupon" },
                { status: error.message === "Coupon code already exists" ? 409 : 500 }
            );
        }
    }

    async validateCoupon(req: NextRequest) {
        try {
            const body = await req.json();
            if (!body.code) {
                return NextResponse.json({ success: false, error: "Coupon code is required" }, { status: 400 });
            }
            const coupon = await couponService.validateCoupon(body.code);
            return NextResponse.json({ success: true, data: coupon }, { status: 200 });
        } catch (error: any) {
            return NextResponse.json(
                { success: false, error: error.message || "Failed to validate coupon" },
                { status: error.message.includes("Invalid") || error.message.includes("not") || error.message.includes("expired") || error.message.includes("limit") ? 400 : 500 }
            );
        }
    }

    async getAllCoupons(req: NextRequest) {
        try {
            const coupons = await couponService.getAllCoupons();
            return NextResponse.json({ success: true, data: coupons }, { status: 200 });
        } catch (error: any) {
            return NextResponse.json(
                { success: false, error: error.message || "Failed to fetch coupons" },
                { status: 500 }
            );
        }
    }

    async updateCoupon(req: NextRequest, { params }: { params: { id: string } }) {
        try {
            const body = await req.json();
            const updatedCoupon = await couponService.updateCoupon(params.id, body);
            return NextResponse.json({ success: true, data: updatedCoupon }, { status: 200 });
        } catch (error: any) {
            console.error("updateCoupon Error:", error.message);
            if (error.name === "ValidationError") {
                return NextResponse.json(
                    { success: false, errors: error.errors },
                    { status: 400 }
                );
            }
            return NextResponse.json(
                { success: false, error: error.message || "Failed to update coupon" },
                { status: error.message === "Coupon not found" ? 404 : error.message === "Coupon code already exists" ? 409 : 500 }
            );
        }
    }

    async deleteCoupon(req: NextRequest, { params }: { params: { id: string } }) {
        try {
            await couponService.deleteCoupon(params.id);
            return NextResponse.json({ success: true }, { status: 200 });
        } catch (error: any) {
            return NextResponse.json(
                { success: false, error: error.message || "Failed to delete coupon" },
                { status: error.message === "Coupon not found" ? 404 : 500 }
            );
        }
    }
}

export const couponController = new CouponController();
