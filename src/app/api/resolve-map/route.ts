import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const url = req.nextUrl.searchParams.get("url");
    const address = req.nextUrl.searchParams.get("address") || "";

    // If no URL or not a Google Maps link, fallback to text address
    if (!url || (!url.includes("maps.app.goo.gl") && !url.includes("google.com/maps"))) {
        return NextResponse.redirect(`https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`);
    }

    try {
        const response = await fetch(url, { redirect: 'manual' });
        const location = response.headers.get("location");

        if (location) {
            let q = "";
            const searchMatch = location.match(/search\/([^?\/]+)/);
            if (searchMatch) {
                q = searchMatch[1]; // e.g. 26.758355,+80.949870
            } else {
                const atMatch = location.match(/@([0-9.-]+),([0-9.-]+)/);
                if (atMatch) {
                    q = `${atMatch[1]},${atMatch[2]}`;
                }
            }
            if (q) {
                return NextResponse.redirect(`https://maps.google.com/maps?q=${q}&t=&z=15&ie=UTF8&iwloc=&output=embed`);
            }
        }
    } catch (e) {
        console.error("Map link resolution error:", e);
    }

    // Fallback if resolving failed or no coordinates found
    return NextResponse.redirect(`https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`);
}
