import Enquiry, { IEnquiry } from "@/models/Enquiry";
import dbConnect from "@/lib/db";

export class EnquiryRepository {
    async create(data: Partial<IEnquiry>): Promise<IEnquiry> {
        await dbConnect();
        const enquiry = await Enquiry.create(data);
        return JSON.parse(JSON.stringify(enquiry));
    }

    async findAll(): Promise<IEnquiry[]> {
        await dbConnect();
        const enquiries = await Enquiry.find().sort({ createdAt: -1 }).lean();
        return JSON.parse(JSON.stringify(enquiries));
    }

    async updateStatus(id: string, status: string): Promise<IEnquiry | null> {
        await dbConnect();
        const enquiry = await Enquiry.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        ).lean();
        return enquiry ? JSON.parse(JSON.stringify(enquiry)) : null;
    }

    async delete(id: string): Promise<boolean> {
        await dbConnect();
        const result = await Enquiry.findByIdAndDelete(id);
        return !!result;
    }
}

export const enquiryRepository = new EnquiryRepository();
