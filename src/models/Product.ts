import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
    name: string;
    price: number;
    image: string; // Storing image path/URL
    category: string;
    description?: string;
    inStock?: boolean;
}

const ProductSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        image: { type: String, required: true },
        category: { type: String, required: true },
        description: { type: String, required: false },
        inStock: { type: Boolean, default: true },
    },
    {
        timestamps: true,
    }
);

// Prevent mongoose from compiling the model multiple times upon hot reloads in dev
const Product: Model<IProduct> =
    mongoose.models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
