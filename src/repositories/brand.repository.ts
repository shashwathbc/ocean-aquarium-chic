import Brand, { IBrand } from "@/models/Brand";
import connectDB from "@/lib/db";

export class BrandRepository {
    async findAll(): Promise<IBrand[]> {
        await connectDB();
        return Brand.find({}).sort({ createdAt: -1 });
    }

    async findById(id: string): Promise<IBrand | null> {
        await connectDB();
        return Brand.findById(id);
    }

    async findBySlug(slug: string): Promise<IBrand | null> {
        await connectDB();
        return Brand.findOne({ slug });
    }

    async create(data: Partial<IBrand>): Promise<IBrand> {
        await connectDB();
        return Brand.create(data);
    }

    async update(id: string, data: Partial<IBrand>): Promise<IBrand | null> {
        await connectDB();
        return Brand.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        });
    }

    async delete(id: string): Promise<IBrand | null> {
        await connectDB();
        return Brand.findByIdAndDelete(id);
    }
}

export const brandRepository = new BrandRepository();
