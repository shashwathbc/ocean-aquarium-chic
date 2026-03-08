import { NextRequest } from "next/server";
import { reviewController } from "@/controllers/review.controller";

export async function GET(req: NextRequest) {
    return reviewController.getAllReviews(req);
}
