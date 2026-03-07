import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISettings extends Document {
    shopLocation: string;
}

const SettingsSchema: Schema = new Schema(
    {
        shopLocation: { type: String, required: false, default: "" },
    },
    {
        timestamps: true,
    }
);

// Prevent mongoose from compiling the model multiple times upon hot reloads in dev
const Settings: Model<ISettings> =
    mongoose.models.Settings || mongoose.model<ISettings>('Settings', SettingsSchema);

export default Settings;
