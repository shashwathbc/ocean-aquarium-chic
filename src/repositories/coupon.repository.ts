import Coupon, { ICoupon } from "@/models/Coupon";
import dbConnect from "@/lib/db";

export class CouponRepository {
    async create(data: Partial<ICoupon>): Promise<ICoupon> {
        await dbConnect();
        const coupon = await Coupon.create(data);
        return JSON.parse(JSON.stringify(coupon));
    }

    async findAll(): Promise<ICoupon[]> {
        await dbConnect();
        const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();
        return JSON.parse(JSON.stringify(coupons));
    }

    async findById(id: string): Promise<ICoupon | null> {
        await dbConnect();
        const coupon = await Coupon.findById(id).lean();
        return coupon ? JSON.parse(JSON.stringify(coupon)) : null;
    }

    async findByCode(code: string): Promise<ICoupon | null> {
        await dbConnect();
        const coupon = await Coupon.findOne({ code: code.toUpperCase() }).lean();
        return coupon ? JSON.parse(JSON.stringify(coupon)) : null;
    }

    async update(id: string, data: Partial<ICoupon>): Promise<ICoupon | null> {
        await dbConnect();
        const coupon = await Coupon.findByIdAndUpdate(id, data, { new: true }).lean();
        return coupon ? JSON.parse(JSON.stringify(coupon)) : null;
    }

    async delete(id: string): Promise<boolean> {
        await dbConnect();
        const result = await Coupon.findByIdAndDelete(id);
        return !!result;
    }
}

export const couponRepository = new CouponRepository();
