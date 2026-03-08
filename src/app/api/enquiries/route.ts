import { NextRequest } from "next/server";
import { enquiryController } from "@/controllers/enquiry.controller";

export async function GET(req: NextRequest) {
    return enquiryController.getAllEnquiries(req);
}

export async function POST(req: NextRequest) {
    return enquiryController.createEnquiry(req);
}
