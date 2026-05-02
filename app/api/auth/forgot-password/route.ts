import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import User from "@/models/User";
import { buildPasswordResetEmail, sendEmail } from "@/lib/mailer";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      // Return success even if user not found to prevent email enumeration
      return NextResponse.json({ message: "If an account with that email exists, we sent a password reset link." });
    }

    // Generate token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000); // 1 hour from now

    // Save to user
    user.resetPasswordToken = token;
    user.resetPasswordExpires = expires;
    await user.save();

    // Create reset link
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const resetLink = `${baseUrl}/auth/reset-password?token=${token}`;

    const parsedEmail = await buildPasswordResetEmail(user.name, resetLink);

    await sendEmail({
      to: user.email,
      subject: parsedEmail.subject,
      html: parsedEmail.html,
    });

    return NextResponse.json({ message: "If an account with that email exists, we sent a password reset link." });
  } catch (error: any) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
