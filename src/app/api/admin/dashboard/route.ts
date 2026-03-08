import { NextRequest } from "next/server";
import { dashboardController } from "@/controllers/dashboard.controller";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
    return dashboardController.getDashboardMetrics(req);
}
