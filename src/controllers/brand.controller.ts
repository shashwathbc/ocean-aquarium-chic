import { NextResponse } from "next/server";
import { brandService } from "@/services/brand.service";

export class BrandController {
    async getBrands() {
        try {
            const brands = await brandService.getAllBrands();
            return NextResponse.json({ success: true, data: brands }, { status: 200 });
        } catch (error: any) {
            return NextResponse.json(
                { success: false, error: error.message || "Failed to fetch brands" },
                { status: 500 }
            );
        }
    }

    async getBrand(req: Request, { params }: { params: { id: string } }) {
        try {
            const brand = await brandService.getBrandById(params.id);
            return NextResponse.json({ success: true, data: brand }, { status: 200 });
        } catch (error: any) {
            const status = error.message === "Brand not found" ? 404 : 400;
            return NextResponse.json(
                { success: false, error: error.message },
                { status }
            );
        }
    }

    async createBrand(req: Request) {
        try {
            const body = await req.json();
            const newBrand = await brandService.createBrand(body);
            return NextResponse.json({ success: true, data: newBrand }, { status: 201 });
        } catch (error: any) {
            return NextResponse.json(
                { success: false, error: error.message || "Failed to create brand" },
                { status: 400 }
            );
        }
    }

    async updateBrand(req: Request, { params }: { params: { id: string } }) {
        try {
            const body = await req.json();
            const updatedBrand = await brandService.updateBrand(params.id, body);
            return NextResponse.json({ success: true, data: updatedBrand }, { status: 200 });
        } catch (error: any) {
            const status = error.message === "Brand not found" ? 404 :
                error.message === "Invalid brand ID format" ? 400 : 500;
            return NextResponse.json(
                { success: false, error: error.message || "Failed to update brand" },
                { status }
            );
        }
    }

    async deleteBrand(req: Request, { params }: { params: { id: string } }) {
        try {
            await brandService.deleteBrand(params.id);
            return NextResponse.json({ success: true, message: "Brand deleted successfully" }, { status: 200 });
        } catch (error: any) {
            const status = error.message === "Brand not found" ? 404 :
                error.message === "Invalid brand ID format" ? 400 : 500;
            return NextResponse.json(
                { success: false, error: error.message || "Failed to delete brand" },
                { status }
            );
        }
    }
}

export const brandController = new BrandController();
