import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IOrder extends Document {
    customerDetails: {
        name: string;
        phone: string;
        address: string;
    };
    items: {
        productId: mongoose.Types.ObjectId;
        name: string;
        quantity: number;
        price: number;
        image?: string;
    }[];
    totalAmount: number;
    couponCode?: string;
    discountAmount?: number;
    status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    paymentMethod: string;
    createdAt: Date;
    updatedAt: Date;
}

const OrderSchema: Schema = new Schema(
    {
        customerDetails: {
            name: { type: String, required: true },
            phone: { type: String, required: true },
            address: { type: String, required: true },
        },
        items: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true
                },
                name: { type: String, required: true },
                quantity: { type: Number, required: true, min: 1 },
                price: { type: Number, required: true },
                image: { type: String, required: false },
            }
        ],
        totalAmount: { type: Number, required: true },
        couponCode: { type: String, required: false },
        discountAmount: { type: Number, required: false },
        status: {
            type: String,
            enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
            default: 'pending'
        },
        paymentMethod: { type: String, default: 'COD' }
    },
    {
        timestamps: true,
    }
);

if (mongoose.models.Order) {
    delete mongoose.models.Order;
}

const Order: Model<IOrder> = mongoose.model<IOrder>('Order', OrderSchema);

export default Order;
