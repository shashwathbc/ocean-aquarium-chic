import { NextRequest } from "next/server";
import { productController } from "@/controllers/product.controller";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    return productController.getProduct(req, { params: resolvedParams });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    return productController.updateProduct(req, { params: resolvedParams });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    return productController.deleteProduct(req, { params: resolvedParams });
}
