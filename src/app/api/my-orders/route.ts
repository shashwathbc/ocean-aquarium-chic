import { NextRequest } from "next/server";
import { orderController } from "@/controllers/order.controller";

export async function GET(req: NextRequest) {
    return orderController.getOrdersByPhone(req);
}
