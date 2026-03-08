import { brandRepository } from "@/repositories/brand.repository";
import { IBrand } from "@/models/Brand";
import slugify from "slugify";

export class BrandService {
    async getAllBrands() {
        return brandRepository.findAll();
    }

    async getBrandById(id: string) {
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            throw new Error("Invalid brand ID format");
        }
        const brand = await brandRepository.findById(id);
        if (!brand) throw new Error("Brand not found");
        return brand;
    }

    async createBrand(data: Partial<IBrand>) {
        if (!data.name) throw new Error("Brand name is required");

        let slug = data.slug;
        if (!slug) {
            slug = slugify(data.name, { lower: true, strict: true });
        }

        const existingBrand = await brandRepository.findBySlug(slug);
        if (existingBrand) {
            throw new Error("A brand with this name or slug already exists");
        }

        const brandData = { ...data, slug };
        return brandRepository.create(brandData);
    }

    async updateBrand(id: string, data: Partial<IBrand>) {
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            throw new Error("Invalid brand ID format");
        }

        // Check exists
        await this.getBrandById(id);

        let updateData = { ...data };

        // If name changes but slug is not provided in update, generate new slug
        if (data.name && !data.slug) {
            updateData.slug = slugify(data.name, { lower: true, strict: true });
        }

        // If slug is being updated (either manually or auto-generated), ensure it's unique
        if (updateData.slug) {
            const existingBrand = await brandRepository.findBySlug(updateData.slug);
            if (existingBrand && existingBrand._id.toString() !== id) {
                throw new Error("A brand with this name or slug already exists");
            }
        }

        const updatedBrand = await brandRepository.update(id, updateData);
        if (!updatedBrand) throw new Error("Brand not found during update");
        return updatedBrand;
    }

    async deleteBrand(id: string) {
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            throw new Error("Invalid brand ID format");
        }

        const deletedBrand = await brandRepository.delete(id);
        if (!deletedBrand) throw new Error("Brand not found");
        return deletedBrand;
    }
}

export const brandService = new BrandService();
