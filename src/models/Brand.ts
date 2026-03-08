import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBrand extends Document {
    name: string;
    slug: string;
    description?: string;
    image?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const BrandSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Brand name is required'],
            unique: true,
            trim: true,
            maxlength: [50, 'Name cannot be more than 50 characters'],
        },
        slug: {
            type: String,
            unique: true,
        },
        description: {
            type: String,
            maxlength: [500, 'Description cannot be more than 500 characters'],
        },
        image: {
            type: String,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);
// Add unique indexes
BrandSchema.index({ name: 1 }, { unique: true });
BrandSchema.index({ slug: 1 }, { unique: true });

export default mongoose.models.Brand || mongoose.model<IBrand>('Brand', BrandSchema);
