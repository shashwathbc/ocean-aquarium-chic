import Review, { IReview } from "@/models/Review";
import dbConnect from "@/lib/db";
import mongoose from "mongoose";

export class ReviewRepository {
    async findByProductId(productId: string): Promise<IReview[]> {
        await dbConnect();
        const reviews = await Review.find({
            productId: new mongoose.Types.ObjectId(productId),
            status: 'approved'
        }).sort({ createdAt: -1 }).lean();
        return JSON.parse(JSON.stringify(reviews));
    }

    async findAll(): Promise<IReview[]> {
        await dbConnect();
        // Populate the productId to get the product name
        const reviews = await Review.find()
            .populate('productId', 'name image')
            .sort({ createdAt: -1 })
            .lean();
        return JSON.parse(JSON.stringify(reviews));
    }

    async create(reviewData: Partial<IReview>): Promise<IReview> {
        await dbConnect();
        const review = await Review.create(reviewData);
        return JSON.parse(JSON.stringify(review));
    }

    async delete(id: string): Promise<boolean> {
        await dbConnect();
        const result = await Review.findByIdAndDelete(id);
        return result !== null;
    }
}

export const reviewRepository = new ReviewRepository();
