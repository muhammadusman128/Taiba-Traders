import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Visitor from "@/models/Visitor";

export async function POST(req: Request) {
  try {
    await connectDB();
    const forwardedFor = req.headers.get("x-forwarded-for");
    const ip = forwardedFor ? forwardedFor.split(",")[0].trim() : "anonymous";
    
    // Get current date string in YYYY-MM-DD format
    const date = new Date().toISOString().split("T")[0];

    await Visitor.findOneAndUpdate(
      { ip, date },
      { $inc: { count: 1 } },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Traffic tracking error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
