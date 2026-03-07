import Product, { IProduct } from "@/models/Product";
import dbConnect from "@/lib/db";

export class ProductRepository {
    async findAll(): Promise<IProduct[]> {
        await dbConnect();
        const products = await Product.find({}).lean();
        return JSON.parse(JSON.stringify(products));
    }

    async findById(id: string): Promise<IProduct | null> {
        await dbConnect();
        const product = await Product.findById(id).lean();
        if (!product) return null;
        return JSON.parse(JSON.stringify(product));
    }

    async create(productData: Partial<IProduct>): Promise<IProduct> {
        await dbConnect();
        const product = await Product.create(productData);
        return JSON.parse(JSON.stringify(product));
    }

    async insertMany(products: Partial<IProduct>[]): Promise<IProduct[]> {
        await dbConnect();
        const insertedProducts = await Product.insertMany(products);
        return JSON.parse(JSON.stringify(insertedProducts));
    }

    async update(id: string, productData: Partial<IProduct>): Promise<IProduct | null> {
        await dbConnect();
        const product = await Product.findByIdAndUpdate(id, productData, { new: true }).lean();
        if (!product) return null;
        return JSON.parse(JSON.stringify(product));
    }

    async delete(id: string): Promise<boolean> {
        await dbConnect();
        const result = await Product.findByIdAndDelete(id);
        return result !== null;
    }
}

export const productRepository = new ProductRepository();
