import { couponRepository } from "@/repositories/coupon.repository";
import * as yup from "yup";

const couponSchema = yup.object().shape({
    code: yup.string().required("Coupon code is required").trim().uppercase(),
    discountPercentage: yup.number().min(1).max(100).required("Discount percentage is required"),
    startDate: yup.date().required("Start date is required"),
    endDate: yup.date().required("End date is required").min(yup.ref('startDate'), "End date must be after start date"),
    isActive: yup.boolean().default(true),
    usageLimit: yup.number().nullable().transform((v) => v === null ? undefined : v).optional(),
});

const updateCouponSchema = yup.object().shape({
    code: yup.string().trim().uppercase().optional(),
    discountPercentage: yup.number().min(1).max(100).optional(),
    startDate: yup.date().optional(),
    endDate: yup.date().when('startDate', (startDate, schema) => {
        return startDate ? schema.min(startDate, "End date must be after start date") : schema;
    }).optional(),
    isActive: yup.boolean().optional(),
    usageLimit: yup.number().nullable().transform((v) => v === null ? undefined : v).optional(),
});

export class CouponService {
    async createCoupon(data: any) {
        const validatedData = await couponSchema.validate(data, { abortEarly: false, stripUnknown: true });

        const existing = await couponRepository.findByCode(validatedData.code);
        if (existing) {
            throw new Error("Coupon code already exists");
        }

        return await couponRepository.create(validatedData as any);
    }

    async getAllCoupons() {
        return await couponRepository.findAll();
    }

    async getCouponByCode(code: string) {
        const coupon = await couponRepository.findByCode(code);
        if (!coupon) throw new Error("Coupon not found");
        return coupon;
    }

    async validateCoupon(code: string) {
        const coupon = await couponRepository.findByCode(code);
        if (!coupon) throw new Error("Invalid coupon code");

        if (!coupon.isActive) {
            throw new Error("This coupon is no longer active");
        }

        const now = new Date();
        if (now < new Date(coupon.startDate)) {
            throw new Error("This coupon is not active yet");
        }
        if (now > new Date(coupon.endDate)) {
            throw new Error("This coupon has expired");
        }

        if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
            throw new Error("This coupon has reached its usage limit");
        }

        return coupon;
    }

    async updateCoupon(id: string, data: any) {
        const validatedData = await updateCouponSchema.validate(data, { abortEarly: false, stripUnknown: true });

        if (validatedData.code) {
            const existing = await couponRepository.findByCode(validatedData.code);

            // If the coupon exists, verify we aren't just updating the same coupon
            if (existing) {
                const existingId = existing._id.toString();
                if (existingId !== id) {
                    throw new Error("Coupon code already exists");
                }
            }
        }

        const updated = await couponRepository.update(id, validatedData as any);
        if (!updated) throw new Error("Coupon not found");
        return updated;
    }

    async deleteCoupon(id: string) {
        const deleted = await couponRepository.delete(id);
        if (!deleted) throw new Error("Coupon not found");
        return deleted;
    }
}

export const couponService = new CouponService();
