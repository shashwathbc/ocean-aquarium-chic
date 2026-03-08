import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

export async function POST(req: NextRequest) {
    try {
        const data = await req.formData();
        const file: File | null = data.get("file") as unknown as File;

        if (!file) {
            return NextResponse.json({ success: false, error: "No file uploaded" }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // We will save files into public/uploads
        const uploadDir = join(process.cwd(), "public", "uploads");

        // Create the directory if it doesn't exist
        try {
            await mkdir(uploadDir, { recursive: true });
        } catch (err) {
            // ignore if directory exists
        }

        // Clean filename and make unique
        const cleanName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '');
        const filename = `${Date.now()}-${cleanName}`;
        const filePath = join(uploadDir, filename);

        // Save the file
        await writeFile(filePath, buffer);

        // Return the publicly accessible URL
        const fileUrl = `/uploads/${filename}`;

        return NextResponse.json({ success: true, url: fileUrl }, { status: 201 });
    } catch (error: any) {
        console.error("Upload error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to upload file" },
            { status: 500 }
        );
    }
}
