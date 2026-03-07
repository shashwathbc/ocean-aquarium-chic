import { NextRequest } from "next/server";
import { productController } from "@/controllers/product.controller";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    return productController.getProduct(req, { params });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    return productController.updateProduct(req, { params });
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    return productController.deleteProduct(req, { params });
}
