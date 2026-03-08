import { NextRequest } from "next/server";
import { orderController } from "@/controllers/order.controller";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    return orderController.updateOrderStatus(req, { params: resolvedParams });
}
