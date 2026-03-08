import { enquiryRepository } from "@/repositories/enquiry.repository";
import * as yup from "yup";

const enquirySchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    subject: yup.string().optional(),
    message: yup.string().required("Message is required"),
});

export class EnquiryService {
    async createEnquiry(data: any) {
        const validatedData = await enquirySchema.validate(data, { abortEarly: false, stripUnknown: true });
        return await enquiryRepository.create(validatedData);
    }

    async getAllEnquiries() {
        return await enquiryRepository.findAll();
    }

    async updateStatus(id: string, status: string) {
        if (!['new', 'read', 'replied'].includes(status)) {
            throw new Error("Invalid status");
        }
        const updated = await enquiryRepository.updateStatus(id, status);
        if (!updated) throw new Error("Enquiry not found");
        return updated;
    }

    async deleteEnquiry(id: string) {
        const deleted = await enquiryRepository.delete(id);
        if (!deleted) throw new Error("Enquiry not found");
        return deleted;
    }
}

export const enquiryService = new EnquiryService();
