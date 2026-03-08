import { NextRequest } from "next/server";
import { settingsController } from "@/controllers/settings.controller";

export async function GET(req: NextRequest) {
    return settingsController.getSettings(req);
}

export async function PUT(req: NextRequest) {
    return settingsController.updateSettings(req);
}
