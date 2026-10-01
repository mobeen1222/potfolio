import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { PortfolioData } from "@/types/portfolio";

const dataFilePath = path.join(process.cwd(), "data", "portfolio.json");

export async function GET() {
  try {
    if (fs.existsSync(dataFilePath)) {
      const fileContent = fs.readFileSync(dataFilePath, "utf8");
      const data: PortfolioData = JSON.parse(fileContent);
      return NextResponse.json(data);
    }
    return NextResponse.json({ error: "Data file not found" }, { status: 404 });
  } catch (error) {
    console.error("API GET Error:", error);
    return NextResponse.json({ error: "Failed to read portfolio data" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const updatedData: PortfolioData = await request.json();
    
    // Ensure data directory exists
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Save updated data formatted nicely
    fs.writeFileSync(dataFilePath, JSON.stringify(updatedData, null, 2), "utf8");

    return NextResponse.json({ success: true, message: "Portfolio data updated successfully" });
  } catch (error) {
    console.error("API POST Error:", error);
    return NextResponse.json({ error: "Failed to save portfolio data" }, { status: 500 });
  }
}
