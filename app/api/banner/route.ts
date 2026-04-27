import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Setting from "@/models/Setting";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

// GET public banner text
export async function GET() {
  try {
    await connectDB();
    const doc = await Setting.findOne({ key: "topBanner" });
    const text = doc?.value?.text || "DEAL IN TEXTILES ACCESSORIES AND GARMENTS";
    const isActive = doc?.value?.isActive ?? true;
    const bgColor = doc?.value?.bgColor || "#000000";
    const textColor = doc?.value?.textColor || "#ffffff";
    return NextResponse.json({ text, isActive, bgColor, textColor, updatedAt: doc?.updatedAt ?? null });
  } catch (error: any) {
    console.error("Get banner error:", error);
    return NextResponse.json(
      { error: "Failed to fetch banner" },
      { status: 500 },
    );
  }
}

// PUT update banner text - admin only
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 },
      );
    }
    if (session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 },
      );
    }

    await connectDB();
    const data = await req.json();
    const text = typeof data.text === "string" ? data.text.trim() : "";
    const isActive = typeof data.isActive === "boolean" ? data.isActive : true;
    const bgColor = typeof data.bgColor === "string" ? data.bgColor : "#000000";
    const textColor = typeof data.textColor === "string" ? data.textColor : "#ffffff";

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const updated = await Setting.findOneAndUpdate(
      { key: "topBanner" },
      { value: { text, isActive, bgColor, textColor } },
      { upsert: true, new: true },
    );

    return NextResponse.json({
      text: updated.value.text,
      isActive: updated.value.isActive,
      bgColor: updated.value.bgColor,
      textColor: updated.value.textColor,
      updatedAt: updated.updatedAt,
    });
  } catch (error: any) {
    console.error("Update banner error:", error);
    return NextResponse.json(
      { error: "Failed to update banner" },
      { status: 500 },
    );
  }
}
