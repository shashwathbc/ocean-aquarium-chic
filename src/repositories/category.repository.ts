import Category, { ICategory } from '@/models/Category';
import dbConnect from '@/lib/db';

export class CategoryRepository {
    async findAll(): Promise<ICategory[]> {
        await dbConnect();
        return Category.find({}).sort({ createdAt: -1 }).exec();
    }

    async findById(id: string): Promise<ICategory | null> {
        await dbConnect();
        return Category.findById(id).exec();
    }

    async findBySlug(slug: string): Promise<ICategory | null> {
        await dbConnect();
        return Category.findOne({ slug }).exec();
    }

    async create(categoryData: Partial<ICategory>): Promise<ICategory> {
        await dbConnect();
        const category = new Category(categoryData);
        return category.save();
    }

    async update(id: string, updateData: Partial<ICategory>): Promise<ICategory | null> {
        await dbConnect();
        return Category.findByIdAndUpdate(id, updateData, { new: true, runValidators: true }).exec();
    }

    async delete(id: string): Promise<ICategory | null> {
        await dbConnect();
        return Category.findByIdAndDelete(id).exec();
    }
}

export const categoryRepository = new CategoryRepository();
