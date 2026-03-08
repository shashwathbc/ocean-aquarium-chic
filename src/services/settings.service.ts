import { settingsRepository } from "@/repositories/settings.repository";
import * as yup from "yup";

// Yup Validation Schema for updating settings
const updateSettingsSchema = yup.object().shape({
    shopLocation: yup.string().optional(),
    heroBackground: yup.string().optional(),
    address: yup.string().optional(),
    mapLocation: yup.string().optional(),
    phone: yup.string().optional(),
    websiteName: yup.string().optional(),
});

export class SettingsService {
    async getSettings() {
        return await settingsRepository.getSettings();
    }

    async updateSettings(data: any) {
        // Validate partial data using yup
        const validatedData = await updateSettingsSchema.validate(data, { abortEarly: false, stripUnknown: true });

        const updatedSettings = await settingsRepository.updateSettings(validatedData);
        return updatedSettings;
    }
}

export const settingsService = new SettingsService();
