import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICoupon extends Document {
    code: string;
    discountPercentage: number;
    startDate: Date;
    endDate: Date;
    isActive: boolean;
    usageLimit?: number;
    usedCount: number;
}

const CouponSchema: Schema = new Schema(
    {
        code: { type: String, required: true, unique: true, uppercase: true, trim: true },
        discountPercentage: { type: Number, required: true, min: 1, max: 100 },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        isActive: { type: Boolean, default: true },
        usageLimit: { type: Number, default: null },
        usedCount: { type: Number, default: 0 }
    },
    {
        timestamps: true,
    }
);

if (mongoose.models.Coupon) {
    delete mongoose.models.Coupon;
}

const Coupon: Model<ICoupon> = mongoose.model<ICoupon>('Coupon', CouponSchema);

export default Coupon;
