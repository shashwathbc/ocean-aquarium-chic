import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    name: string;
    email: string;
    number?: string;
    password?: string; // Optional because of future OAuth possibilities
    role: 'user' | 'admin' | 'staff';
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema = new Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a name'],
            trim: true,
            maxlength: [50, 'Name cannot be more than 50 characters'],
        },
        email: {
            type: String,
            required: [true, 'Please provide an email'],
            unique: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please provide a valid email',
            ],
        },
        password: {
            type: String,
            select: false, // Don't return password by default
        },
        number: {
            type: String,
            trim: true,
            maxlength: [20, 'Phone number cannot be more than 20 characters'],
        },
        role: {
            type: String,
            enum: ['user', 'admin', 'staff'],
            default: 'user',
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
