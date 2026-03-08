import { NextRequest, NextResponse } from "next/server";
import { reviewService } from "@/services/review.service";

export class ReviewController {

    async getProductReviews(req: NextRequest, { params }: { params: { id: string } }) {
        try {
            const reviews = await reviewService.getReviewsByProduct(params.id);
            return NextResponse.json({ success: true, data: reviews }, { status: 200 });
        } catch (error: any) {
            const status = error.message === "Invalid product ID format" ? 400 : 500;
            return NextResponse.json(
                { success: false, error: error.message || "Failed to fetch reviews" },
                { status }
            );
        }
    }

    async createReview(req: NextRequest, { params }: { params: { id: string } }) {
        try {
            const body = await req.json();
            const payload = { ...body, productId: params.id };
            const newReview = await reviewService.createReview(payload);
            return NextResponse.json({ success: true, data: newReview }, { status: 201 });
        } catch (error: any) {
            if (error.name === "ValidationError") {
                return NextResponse.json(
                    { success: false, errors: error.errors }, // Yup validation errors array
                    { status: 400 }
                );
            }
            return NextResponse.json(
                { success: false, error: error.message || "Failed to submit review" },
                { status: 500 }
            );
        }
    }

    async getAllReviews(req: NextRequest) {
        try {
            const reviews = await reviewService.getAllReviews();
            return NextResponse.json({ success: true, data: reviews }, { status: 200 });
        } catch (error: any) {
            return NextResponse.json(
                { success: false, error: error.message || "Failed to fetch all reviews" },
                { status: 500 }
            );
        }
    }

    async deleteReview(req: NextRequest, { params }: { params: { id: string } }) {
        try {
            await reviewService.deleteReview(params.id);
            return NextResponse.json({ success: true, message: "Review deleted successfully" }, { status: 200 });
        } catch (error: any) {
            const status = error.message === "Review not found" ? 404 :
                error.message === "Invalid review ID format" ? 400 : 500;
            return NextResponse.json(
                { success: false, error: error.message || "Failed to delete review" },
                { status }
            );
        }
    }
}

export const reviewController = new ReviewController();
