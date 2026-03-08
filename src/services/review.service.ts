import { reviewRepository } from "@/repositories/review.repository";
import * as yup from "yup";
import mongoose from "mongoose";

// Yup Validation Schema for creating a review
const reviewSchema = yup.object().shape({
    productId: yup.string().required("Product ID is required"),
    userName: yup.string().required("Name is required").min(2, "Name must be at least 2 characters"),
    rating: yup.number().required("Rating is required").min(1, "Rating must be between 1 and 5").max(5, "Rating must be between 1 and 5"),
    comment: yup.string().required("Comment is required").min(5, "Comment must be at least 5 characters"),
});

export class ReviewService {
    async getReviewsByProduct(productId: string) {
        if (!productId.match(/^[0-9a-fA-F]{24}$/)) {
            throw new Error("Invalid product ID format");
        }
        return await reviewRepository.findByProductId(productId);
    }

    async getAllReviews() {
        return await reviewRepository.findAll();
    }

    async createReview(data: any) {
        // Validate incoming payload
        const validatedData = await reviewSchema.validate(data, { abortEarly: false, stripUnknown: true });

        // Convert the string ID into a reliable mongoose ObjectId
        const reviewPayload = {
            ...validatedData,
            productId: new mongoose.Types.ObjectId(validatedData.productId),
            status: 'approved' // Defaulting to approved right now 
        };

        return await reviewRepository.create(reviewPayload as any);
    }

    async deleteReview(id: string) {
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            throw new Error("Invalid review ID format");
        }
        const success = await reviewRepository.delete(id);
        if (!success) {
            throw new Error("Review not found");
        }
        return true;
    }
}

export const reviewService = new ReviewService();
