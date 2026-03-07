import { categoryRepository } from '@/repositories/category.repository';
import { ICategory } from '@/models/Category';

export class CategoryService {
    async getAllCategories(): Promise<ICategory[]> {
        return categoryRepository.findAll();
    }

    async getCategoryById(id: string): Promise<ICategory | null> {
        return categoryRepository.findById(id);
    }

    async getCategoryBySlug(slug: string): Promise<ICategory | null> {
        return categoryRepository.findBySlug(slug);
    }

    async createCategory(categoryData: Partial<ICategory>): Promise<ICategory> {
        // Automatically generate slug if not provided but name is
        if (!categoryData.slug && categoryData.name) {
            categoryData.slug = categoryData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        }

        // Check for existing slug
        if (categoryData.slug) {
            const existing = await categoryRepository.findBySlug(categoryData.slug);
            if (existing) {
                throw new Error(`Category with slug '${categoryData.slug}' already exists`);
            }
        }

        return categoryRepository.create(categoryData);
    }

    async updateCategory(id: string, updateData: Partial<ICategory>): Promise<ICategory | null> {
        // Automatically generate slug if name is updated but slug isn't explicitly provided
        if (updateData.name && !updateData.slug) {
            updateData.slug = updateData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        }

        // Check for existing slug conflicts during update
        if (updateData.slug) {
            const existing = await categoryRepository.findBySlug(updateData.slug);
            // Ensure the existing slug belongs to a DIFFERENT category
            if (existing && existing._id.toString() !== id) {
                throw new Error(`Category with slug '${updateData.slug}' already exists`);
            }
        }

        return categoryRepository.update(id, updateData);
    }

    async deleteCategory(id: string): Promise<ICategory | null> {
        return categoryRepository.delete(id);
    }
}

export const categoryService = new CategoryService();
