import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Sanitize filename and append timestamp
    const cleanFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const uniqueFileName = `${Date.now()}_${cleanFileName}`;

    // Target directory: public/uploads
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, uniqueFileName);
    fs.writeFileSync(filePath, buffer);

    // Public URL served by Next.js static asset server
    const fileUrl = `/uploads/${uniqueFileName}`;

    return NextResponse.json({
      success: true,
      url: fileUrl,
      fileName: uniqueFileName
    });
  } catch (error) {
    console.error("Upload API error:", error);
    return NextResponse.json({ error: "Failed to upload image file" }, { status: 500 });
  }
}
