import { orderRepository } from "@/repositories/order.repository";
import * as yup from "yup";
import mongoose from "mongoose";
import Customer from "@/models/Customer";

const orderSchema = yup.object().shape({
    customerDetails: yup.object().shape({
        name: yup.string().required("Name is required"),
        phone: yup.string().required("Phone is required"),
        address: yup.string().required("Address is required"),
    }).required(),
    items: yup.array().of(
        yup.object().shape({
            productId: yup.string().required(),
            name: yup.string().required(),
            quantity: yup.number().min(1).required(),
            price: yup.number().required(),
            image: yup.string().optional()
        })
    ).required().min(1, "Order must contain at least one item"),
    totalAmount: yup.number().required(),
    couponCode: yup.string().optional(),
    discountAmount: yup.number().optional(),
    paymentMethod: yup.string().default("COD"),
    status: yup.string().oneOf(['pending', 'processing', 'shipped', 'delivered', 'cancelled']).default('pending')
});

const updateStatusSchema = yup.object().shape({
    status: yup.string().oneOf(['pending', 'processing', 'shipped', 'delivered', 'cancelled']).required()
});

export class OrderService {
    async createOrder(data: any) {
        // Validate incoming checkout payload
        const validatedData = await orderSchema.validate(data, { abortEarly: false, stripUnknown: true });

        // Convert string IDs into physical ObjectIDs mapping perfectly to Mongo's backend expectations
        const formattedItems = validatedData.items.map((item) => ({
            ...item,
            productId: new mongoose.Types.ObjectId(item.productId)
        }));

        const orderPayload = {
            ...validatedData,
            items: formattedItems
        };

        // Organic Customer Data Harvesting
        await Customer.findOneAndUpdate(
            { phone: orderPayload.customerDetails.phone },
            {
                $set: {
                    name: orderPayload.customerDetails.name,
                    address: orderPayload.customerDetails.address
                },
                $inc: {
                    totalOrders: 1,
                    totalSpent: orderPayload.totalAmount
                }
            },
            { upsert: true, new: true }
        );

        // If a coupon code is passed, increment its usage count
        if (orderPayload.couponCode) {
            const Coupon = mongoose.models.Coupon || mongoose.model("Coupon");
            await Coupon.findOneAndUpdate(
                { code: orderPayload.couponCode.toUpperCase() },
                { $inc: { usedCount: 1 } }
            );
        }

        return await orderRepository.create(orderPayload as any);
    }

    async getAllOrders() {
        return await orderRepository.findAll();
    }

    async updateOrderStatus(id: string, data: any) {
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            throw new Error("Invalid order ID format");
        }

        const { status } = await updateStatusSchema.validate(data, { stripUnknown: true });

        const updatedOrder = await orderRepository.updateStatus(id, status);
        if (!updatedOrder) {
            throw new Error("Order not found");
        }
        return updatedOrder;
    }

    async getOrdersByPhone(phone: string) {
        if (!phone) throw new Error("Phone number is required");
        return await orderRepository.findByCustomerPhone(phone);
    }
}

export const orderService = new OrderService();
