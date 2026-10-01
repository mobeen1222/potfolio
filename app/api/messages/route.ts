import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  timestamp: string;
  read?: boolean;
}

const messagesFilePath = path.join(process.cwd(), "data", "messages.json");

export async function GET() {
  try {
    if (fs.existsSync(messagesFilePath)) {
      const content = fs.readFileSync(messagesFilePath, "utf8");
      const messages: ContactMessage[] = JSON.parse(content);
      return NextResponse.json(messages);
    }
    return NextResponse.json([]);
  } catch (error) {
    console.error("Messages GET Error:", error);
    return NextResponse.json({ error: "Failed to read messages" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
    }

    const newMessage: ContactMessage = {
      id: `msg-${Date.now()}`,
      name,
      email,
      subject: subject || "General Inquiry",
      message,
      timestamp: new Date().toLocaleString(),
      read: false
    };

    let existingMessages: ContactMessage[] = [];
    if (fs.existsSync(messagesFilePath)) {
      try {
        const content = fs.readFileSync(messagesFilePath, "utf8");
        existingMessages = JSON.parse(content);
      } catch {
        existingMessages = [];
      }
    }

    // Add new message at top
    existingMessages.unshift(newMessage);

    // Save to data/messages.json
    const dataDir = path.join(process.cwd(), "data");
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(messagesFilePath, JSON.stringify(existingMessages, null, 2), "utf8");

    return NextResponse.json({ success: true, message: "Message submitted successfully", data: newMessage });
  } catch (error) {
    console.error("Messages POST Error:", error);
    return NextResponse.json({ error: "Failed to save message" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!fs.existsSync(messagesFilePath)) {
      return NextResponse.json({ success: true });
    }

    const content = fs.readFileSync(messagesFilePath, "utf8");
    let messages: ContactMessage[] = JSON.parse(content);

    if (id) {
      messages = messages.filter((m) => m.id !== id);
    } else {
      messages = []; // Clear all
    }

    fs.writeFileSync(messagesFilePath, JSON.stringify(messages, null, 2), "utf8");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Messages DELETE Error:", error);
    return NextResponse.json({ error: "Failed to delete message" }, { status: 500 });
  }
}
