import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Setting from "@/models/Setting";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

const defaultCards = [
  { icon: "printer", title: "Offset Printing Solutions" },
  { icon: "layers", title: "Graphic Designing Services" },
  { icon: "monitor", title: "Digital Printing Solutions" },
  { icon: "package", title: "Custom Packaging Solutions" },
];

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const settings = await Setting.findOne({ key: "features" });
    if (!settings) {
      return NextResponse.json({
        isActive: false,
        leftBgColor: "#00bcd4",
        leftBgGradient: "#0097a7",
        rightBgColor: "#f4f4f4",
        accentColor: "#00bcd4",
        headingColor: "#111827",
        textColor: "#555555",
        buttonBgColor: "#111827",
        buttonTextColor: "#ffffff",
        preHeadline: "Provide Quality",
        heading: "Print Services",
        description:
          "We host all premium instrumentation from one color duplication and 2 colors printing to 6 and eight color presses. Special finishes like liquid coating, embossing, foil stamping, die cutting and lots of different processes.",
        buttonText: "More Info",
        buttonLink: "/products",
        cards: defaultCards,
      });
    }
    return NextResponse.json(settings.value);
  } catch {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
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
      { key: "features" },
      { value: data },
      { new: true, upsert: true }
    );
    return NextResponse.json(updated.value);
  } catch {
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
