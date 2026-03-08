import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISettings extends Document {
    shopLocation: string;
    heroBackground: string;
    address: string;
    mapLocation: string;
    phone: string;
    websiteName: string;
}

const SettingsSchema: Schema = new Schema(
    {
        shopLocation: { type: String, required: false, default: "" },
        heroBackground: { type: String, required: false, default: "" },
        address: { type: String, required: false, default: "" },
        mapLocation: { type: String, required: false, default: "" },
        phone: { type: String, required: false, default: "" },
        websiteName: { type: String, required: false, default: "Aquarium World" },
    },
    {
        timestamps: true,
    }
);

// Prevent mongoose from compiling the model multiple times upon hot reloads in dev
const Settings: Model<ISettings> =
    mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);

export default Settings;
