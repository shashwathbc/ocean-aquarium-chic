import { NextRequest, NextResponse } from "next/server";
import { dashboardService } from "@/services/dashboard.service";

export class DashboardController {
    async getDashboardMetrics(req: NextRequest) {
        try {
            const metrics = await dashboardService.getMetrics();
            return NextResponse.json({ success: true, data: metrics }, { status: 200 });
        } catch (error: any) {
            console.error("Dashboard Metrics Error:", error);
            return NextResponse.json(
                { success: false, error: "Failed to fetch dashboard metrics" },
                { status: 500 }
            );
        }
    }
}

export const dashboardController = new DashboardController();
