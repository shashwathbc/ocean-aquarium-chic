import { NextRequest, NextResponse } from "next/server";
import { productService } from "@/services/product.service";

export class ProductController {
    async getProducts() {
        try {
            const products = await productService.getAllProducts();
            return NextResponse.json({ success: true, data: products }, { status: 200 });
        } catch (error: any) {
            return NextResponse.json(
                { success: false, error: error.message || "Failed to fetch products" },
                { status: 500 }
            );
        }
    }

    async getProduct(req: NextRequest, { params }: { params: { id: string } }) {
        try {
            const product = await productService.getProductById(params.id);
            return NextResponse.json({ success: true, data: product }, { status: 200 });
        } catch (error: any) {
            const status = error.message === "Product not found" ? 404 : 400;
            return NextResponse.json(
                { success: false, error: error.message },
                { status }
            );
        }
    }

    async createProduct(req: NextRequest) {
        try {
            const body = await req.json();
            const newProduct = await productService.createProduct(body);
            return NextResponse.json({ success: true, data: newProduct }, { status: 201 });
        } catch (error: any) {
            if (error.name === "ValidationError") {
                return NextResponse.json(
                    { success: false, errors: error.errors }, // Yup validation errors array
                    { status: 400 }
                );
            }
            return NextResponse.json(
                { success: false, error: error.message || "Failed to create product" },
                { status: 500 }
            );
        }
    }
    async updateProduct(req: NextRequest, { params }: { params: { id: string } }) {
        try {
            const body = await req.json();
            const updatedProduct = await productService.updateProduct(params.id, body);
            return NextResponse.json({ success: true, data: updatedProduct }, { status: 200 });
        } catch (error: any) {
            if (error.name === "ValidationError") {
                return NextResponse.json(
                    { success: false, errors: error.errors },
                    { status: 400 }
                );
            }
            const status = error.message === "Product not found" ? 404 :
                error.message === "Invalid product ID format" ? 400 : 500;
            return NextResponse.json(
                { success: false, error: error.message || "Failed to update product" },
                { status }
            );
        }
    }

    async deleteProduct(req: NextRequest, { params }: { params: { id: string } }) {
        try {
            await productService.deleteProduct(params.id);
            return NextResponse.json({ success: true, message: "Product deleted successfully" }, { status: 200 });
        } catch (error: any) {
            const status = error.message === "Product not found" ? 404 :
                error.message === "Invalid product ID format" ? 400 : 500;
            return NextResponse.json(
                { success: false, error: error.message || "Failed to delete product" },
                { status }
            );
        }
    }
}

export const productController = new ProductController();
