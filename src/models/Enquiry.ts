import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEnquiry extends Document {
    name: string;
    email: string;
    subject?: string;
    message: string;
    status: 'new' | 'read' | 'replied';
}

const EnquirySchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true },
        subject: { type: String, required: false },
        message: { type: String, required: true },
        status: { type: String, enum: ['new', 'read', 'replied'], default: 'new' }
    },
    {
        timestamps: true,
    }
);

if (mongoose.models.Enquiry) {
    delete mongoose.models.Enquiry;
}

const Enquiry: Model<IEnquiry> = mongoose.model<IEnquiry>('Enquiry', EnquirySchema);

export default Enquiry;
