import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICustomer extends Document {
    name: string;
    phone: string;
    address: string;
    totalOrders: number;
    totalSpent: number;
}

const CustomerSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        phone: { type: String, required: true, unique: true },
        address: { type: String, required: false },
        totalOrders: { type: Number, default: 0 },
        totalSpent: { type: Number, default: 0 },
    },
    {
        timestamps: true,
    }
);

if (mongoose.models.Customer) {
    delete mongoose.models.Customer;
}

const Customer: Model<ICustomer> = mongoose.model<ICustomer>('Customer', CustomerSchema);

export default Customer;
