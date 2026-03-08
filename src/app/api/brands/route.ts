import { NextResponse } from "next/server";
import { brandService } from "@/services/brand.service";

export async function GET() {
    try {
        const brands = await brandService.getAllBrands();
        return NextResponse.json({ success: true, data: brands }, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching brands:", error);
        return NextResponse.json({ success: false, error: "Failed to fetch brands" }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const brand = await brandService.createBrand(body);
        return NextResponse.json({ success: true, data: brand }, { status: 201 });
    } catch (error: any) {
        console.error("Error creating brand:", error);
        return NextResponse.json(
            { success: false, error: error.message || "Failed to create brand" },
            { status: 400 }
        );
    }
}

