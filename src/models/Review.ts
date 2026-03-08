import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IReview extends Document {
    productId: mongoose.Types.ObjectId;
    userName: string;
    rating: number;
    comment: string;
    status: 'pending' | 'approved' | 'rejected';
}

const ReviewSchema: Schema = new Schema(
    {
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        userName: { type: String, required: true },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5
        },
        comment: { type: String, required: true },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'approved' // Defaulting to approved for simplicity right now
        },
    },
    {
        timestamps: true,
    }
);

// Prevents mongoose from compiling the model multiple times upon hot reloads in dev
if (mongoose.models.Review) {
    delete mongoose.models.Review;
}

const Review: Model<IReview> = mongoose.model<IReview>('Review', ReviewSchema);

export default Review;
