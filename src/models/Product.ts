import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IProduct extends Document {
    name: string;
    price: number;
    image: string; // Storing image path/URL
    category: string;
    brand?: string;
    description?: string;
    inStock?: boolean;
    stockCount?: number;
    images?: string[];
}

const ProductSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        image: { type: String, required: true },
        category: { type: String, required: true },
        brand: { type: String, required: false },
        description: { type: String, required: false },
        inStock: { type: Boolean, default: true },
        stockCount: { type: Number, default: 0 },
        images: { type: [String], default: [] },
    },
    {
        timestamps: true,
    }
);

// Prevents mongoose from compiling the model multiple times upon hot reloads in dev,
// but forces schema updates if they occur during an active session
if (mongoose.models.Product) {
    delete mongoose.models.Product;
}
const Product: Model<IProduct> = mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
