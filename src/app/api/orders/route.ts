import { NextRequest } from "next/server";
import { orderController } from "@/controllers/order.controller";

export async function GET(req: NextRequest) {
    return orderController.getAllOrders(req);
}

export async function POST(req: NextRequest) {
    return orderController.createOrder(req);
}
