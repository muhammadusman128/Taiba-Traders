"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft, FiArrowRight } from "react-icons/fi";
import axios from "axios";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage(null);

    try {
      const res = await axios.post("/api/auth/forgot-password", { email });
      setStatusMessage({
        type: "success",
        text: res.data.message + " Redirecting...",
      });
      setEmail(""); // clear email box

      setTimeout(() => {
        router.push("/auth/signin");
      }, 3000);
    } catch (error: any) {
      setStatusMessage({
        type: "error",
        text:
          error.response?.data?.error || "An error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 flex-col py-10 px-4 sm:px-6 lg:px-8 items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8 sm:p-12">
          {/* Header */}
          <div className="mb-8">
            {/* Back Button */}
            <button
              onClick={() => router.back()}
              className="group flex items-center justify-center w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 transition-colors mb-6"
            >
              <FiArrowLeft className="w-4 h-4 text-gray-500 group-hover:text-black transition-colors" />
            </button>

            <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">
              Forgot Password
            </h1>
            <p className="text-sm text-gray-500">
              Enter your email address and we'll send you a link to reset your
              password.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {statusMessage && (
              <div
                className={`p-4 rounded-lg text-sm font-medium ${
                  statusMessage.type === "success"
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}
              >
                {statusMessage.text}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm outline-none transition-all focus:border-black focus:bg-white focus:ring-1 focus:ring-black"
                placeholder="you@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white text-xs font-bold uppercase tracking-widest py-4 rounded-xl hover:bg-gray-800 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 group"
            >
              {isLoading ? (
                "Sending..."
              ) : (
                <>
                  Send Reset Link
                  <FiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center border-t border-gray-100 pt-6">
            <p className="text-sm text-gray-500">
              Remember your password?{" "}
              <Link
                href="/auth/signin"
                className="font-bold text-black hover:underline"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
