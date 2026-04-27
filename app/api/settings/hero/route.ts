import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Setting from "@/models/Setting";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const settings = await Setting.findOne({ key: "hero" });
    if (!settings) {
      return NextResponse.json({
        preHeadline: "",
        headline: "",
        subtitle: "",
        buttonText: "",
        buttonLink: "",
        secondButtonText: "",
        secondButtonLink: "",
        image: "",
        bgColor: "#2d2db5",
        bgGradientColor: "#1a1a6e",
        accentColor: "#e91e8c",
        textColor: "#ffffff",
        overlayOpacity: 40,
        layout: "split",
        imagePosition: "right",
        isActive: false,
      });
    }
    return NextResponse.json(settings.value);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch hero settings" },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    await connectDB();

    const updated = await Setting.findOneAndUpdate(
      { key: "hero" },
      { value: data },
      { new: true, upsert: true }
    );

    return NextResponse.json(updated.value);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update hero settings" },
      { status: 500 }
    );
  }
}
