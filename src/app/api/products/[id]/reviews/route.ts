import { NextRequest } from "next/server";
import { reviewController } from "@/controllers/review.controller";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    return reviewController.getProductReviews(req, { params: resolvedParams });
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    return reviewController.createReview(req, { params: resolvedParams });
}
