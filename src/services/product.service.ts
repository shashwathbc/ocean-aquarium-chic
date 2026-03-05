import { productRepository } from "@/repositories/product.repository";
import * as yup from "yup";

// Yup Validation Schema for creating a product
const productSchema = yup.object().shape({
    name: yup.string().required("Product name is required"),
    price: yup.number().positive("Price must be positive").required("Price is required"),
    image: yup.string().required("Image URL or path is required"),
    category: yup.string().required("Category is required"),
    description: yup.string().optional(),
    inStock: yup.boolean().optional().default(true),
});

export class ProductService {
    async getAllProducts() {
        return await productRepository.findAll();
    }

    async getProductById(id: string) {
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            throw new Error("Invalid product ID format");
        }
        const product = await productRepository.findById(id);
        if (!product) {
            throw new Error("Product not found");
        }
        return product;
    }

    async createProduct(data: any) {
        // Validate data using yup
        const validatedData = await productSchema.validate(data, { abortEarly: false });
        return await productRepository.create(validatedData);
    }

    async seedProducts(products: any[]) {
        // Basic validation could be added here, bypassing for seeding demo
        return await productRepository.insertMany(products);
    }
}

export const productService = new ProductService();
