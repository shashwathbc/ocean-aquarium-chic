import { NextRequest, NextResponse } from "next/server";
import { productService } from "@/services/product.service";
import { products as staticProducts } from "@/components/FeaturedProducts";

export async function GET(req: NextRequest) {
    try {
        // Transform local images and add a generated database friendly structure
        // Since images were statically imported, we map them into strings 
        const seedData = staticProducts.map((p) => ({
            name: p.name,
            price: p.price,
            // The Next.js static asset import has a `.src` or we just take the relative path if available
            image: typeof p.image === 'object' && 'src' in p.image ? (p.image as any).src : String(p.image),
            category: p.category,
        }));

        const result = await productService.seedProducts(seedData);

        return NextResponse.json({
            success: true,
            message: "Successfully seeded products into MongoDB!",
            inserted: result.length
        }, { status: 201 });
    } catch (err: any) {
        return NextResponse.json({
            success: false,
            error: err.message
        }, { status: 500 });
    }
}
