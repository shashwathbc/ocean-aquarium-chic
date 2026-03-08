import { NextRequest } from "next/server";
import { enquiryController } from "@/controllers/enquiry.controller";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    return enquiryController.updateEnquiryStatus(req, { params: resolvedParams });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    return enquiryController.deleteEnquiry(req, { params: resolvedParams });
}
