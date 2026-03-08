import { NextRequest, NextResponse } from "next/server";
import { productService } from "@/services/product.service";

const staticProducts = [
    { name: "Red Betta Fish", price: 499, image: "/assets/product-betta.jpg", category: "Exotic Fish" },
    { name: "Neon Tetra (Pack of 10)", price: 350, image: "/assets/product-neontetra.jpg", category: "Exotic Fish" },
    { name: "Clownfish Pair", price: 1200, image: "/assets/product-clownfish.jpg", category: "Exotic Fish" },
    { name: "Rimless Glass Tank 60cm", price: 4500, image: "/assets/product-tank.jpg", category: "Aquariums" },
    { name: "Java Moss Bunch", price: 120, image: "/assets/product-javamoss.jpg", category: "Aquarium Plants" },
    { name: "Pro LED Light Bar", price: 2800, image: "/assets/product-led.jpg", category: "Lighting" },
    { name: "Blue Discus Fish", price: 3500, image: "/assets/product-discus.jpg", category: "Exotic Fish" },
    { name: "Anubias Nana on Rock", price: 250, image: "/assets/product-anubias.jpg", category: "Aquarium Plants" },
];

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
