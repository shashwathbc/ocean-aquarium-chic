import Order, { IOrder } from "@/models/Order";
import dbConnect from "@/lib/db";
import mongoose from "mongoose";

export class OrderRepository {
    async create(orderData: Partial<IOrder>): Promise<IOrder> {
        await dbConnect();
        const order = await Order.create(orderData);
        return JSON.parse(JSON.stringify(order));
    }

    async findAll(): Promise<IOrder[]> {
        await dbConnect();
        // Populate productId inside the items array to pull in rich data if needed, or rely on snapshot strings
        const orders = await Order.find()
            .sort({ createdAt: -1 })
            .lean();
        return JSON.parse(JSON.stringify(orders));
    }

    async findById(id: string): Promise<IOrder | null> {
        await dbConnect();
        const order = await Order.findById(id).lean();
        return order ? JSON.parse(JSON.stringify(order)) : null;
    }

    async updateStatus(id: string, status: string): Promise<IOrder | null> {
        await dbConnect();
        const order = await Order.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        ).lean();
        return order ? JSON.parse(JSON.stringify(order)) : null;
    }

    async findByCustomerPhone(phone: string): Promise<IOrder[]> {
        await dbConnect();
        const orders = await Order.find({ 'customerDetails.phone': phone })
            .sort({ createdAt: -1 })
            .lean();
        return JSON.parse(JSON.stringify(orders));
    }
}

export const orderRepository = new OrderRepository();
