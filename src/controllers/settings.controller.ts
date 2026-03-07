import { NextRequest, NextResponse } from "next/server";
import { settingsService } from "@/services/settings.service";

export class SettingsController {
    async getSettings(req: NextRequest) {
        try {
            const settings = await settingsService.getSettings();
            return NextResponse.json({ success: true, data: settings || { shopLocation: "" } }, { status: 200 });
        } catch (error: any) {
            return NextResponse.json(
                { success: false, error: error.message || "Failed to fetch settings" },
                { status: 500 }
            );
        }
    }

    async updateSettings(req: NextRequest) {
        try {
            const body = await req.json();
            const updatedSettings = await settingsService.updateSettings(body);
            return NextResponse.json({ success: true, data: updatedSettings }, { status: 200 });
        } catch (error: any) {
            if (error.name === "ValidationError") {
                return NextResponse.json(
                    { success: false, errors: error.errors },
                    { status: 400 }
                );
            }
            return NextResponse.json(
                { success: false, error: error.message || "Failed to update settings" },
                { status: 500 }
            );
        }
    }
}

export const settingsController = new SettingsController();
