import Settings, { ISettings } from "@/models/Settings";
import dbConnect from "@/lib/db";

export class SettingsRepository {
    async getSettings(): Promise<ISettings | null> {
        await dbConnect();
        // Since it's global settings, there should only ever be one document
        const settings = await Settings.findOne({}).lean();
        if (!settings) return null;
        return JSON.parse(JSON.stringify(settings));
    }

    async updateSettings(settingsData: Partial<ISettings>): Promise<ISettings> {
        await dbConnect();

        // Upsert the first document it finds (or empty query)
        const settings = await Settings.findOneAndUpdate(
            {},
            settingsData,
            { new: true, upsert: true }
        ).lean();

        return JSON.parse(JSON.stringify(settings));
    }
}

export const settingsRepository = new SettingsRepository();
