import { NextRequest, NextResponse } from "next/server";
import { orderService } from "@/services/order.service";

export class OrderController {
    async createOrder(req: NextRequest) {
        try {
            const body = await req.json();
            const newOrder = await orderService.createOrder(body);
            return NextResponse.json({ success: true, data: newOrder }, { status: 201 });
        } catch (error: any) {
            if (error.name === "ValidationError") {
                return NextResponse.json(
                    { success: false, errors: error.errors },
                    { status: 400 }
                );
            }
            return NextResponse.json(
                { success: false, error: error.message || "Failed to process order" },
                { status: 500 }
            );
        }
    }

    async getAllOrders(req: NextRequest) {
        try {
            const orders = await orderService.getAllOrders();
            return NextResponse.json({ success: true, data: orders }, { status: 200 });
        } catch (error: any) {
            return NextResponse.json(
                { success: false, error: error.message || "Failed to fetch orders" },
                { status: 500 }
            );
        }
    }

    async updateOrderStatus(req: NextRequest, { params }: { params: { id: string } }) {
        try {
            const body = await req.json();
            const updatedOrder = await orderService.updateOrderStatus(params.id, body);
            return NextResponse.json({ success: true, data: updatedOrder }, { status: 200 });
        } catch (error: any) {
            const status = error.message === "Order not found" ? 404 :
                error.message === "Invalid order ID format" ? 400 : 500;
            return NextResponse.json(
                { success: false, error: error.message || "Failed to update order status" },
                { status }
            );
        }
    }

    async getOrdersByPhone(req: NextRequest) {
        try {
            const { searchParams } = new URL(req.url);
            const phone = searchParams.get("phone");
            if (!phone) {
                return NextResponse.json({ success: false, error: "Phone number is required" }, { status: 400 });
            }
            const orders = await orderService.getOrdersByPhone(phone);
            return NextResponse.json({ success: true, data: orders }, { status: 200 });
        } catch (error: any) {
            return NextResponse.json(
                { success: false, error: error.message || "Failed to fetch orders" },
                { status: 500 }
            );
        }
    }
}

export const orderController = new OrderController();
