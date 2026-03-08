import { NextRequest, NextResponse } from "next/server";
import { enquiryService } from "@/services/enquiry.service";

export class EnquiryController {
    async createEnquiry(req: NextRequest) {
        try {
            const body = await req.json();
            const newEnquiry = await enquiryService.createEnquiry(body);
            return NextResponse.json({ success: true, data: newEnquiry }, { status: 201 });
        } catch (error: any) {
            if (error.name === "ValidationError") {
                return NextResponse.json(
                    { success: false, errors: error.errors },
                    { status: 400 }
                );
            }
            return NextResponse.json(
                { success: false, error: error.message || "Failed to submit enquiry" },
                { status: 500 }
            );
        }
    }

    async getAllEnquiries(req: NextRequest) {
        try {
            const enquiries = await enquiryService.getAllEnquiries();
            return NextResponse.json({ success: true, data: enquiries }, { status: 200 });
        } catch (error: any) {
            return NextResponse.json(
                { success: false, error: error.message || "Failed to fetch enquiries" },
                { status: 500 }
            );
        }
    }

    async updateEnquiryStatus(req: NextRequest, { params }: { params: { id: string } }) {
        try {
            const body = await req.json();
            const updatedEnquiry = await enquiryService.updateStatus(params.id, body.status);
            return NextResponse.json({ success: true, data: updatedEnquiry }, { status: 200 });
        } catch (error: any) {
            return NextResponse.json(
                { success: false, error: error.message || "Failed to update enquiry" },
                { status: error.message === "Enquiry not found" ? 404 : 400 }
            );
        }
    }

    async deleteEnquiry(req: NextRequest, { params }: { params: { id: string } }) {
        try {
            await enquiryService.deleteEnquiry(params.id);
            return NextResponse.json({ success: true }, { status: 200 });
        } catch (error: any) {
            return NextResponse.json(
                { success: false, error: error.message || "Failed to delete enquiry" },
                { status: error.message === "Enquiry not found" ? 404 : 500 }
            );
        }
    }
}

export const enquiryController = new EnquiryController();
