"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FiArrowRight, FiEye, FiEyeOff } from "react-icons/fi";
import axios from "axios";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams?.get("token") ?? null;

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  useEffect(() => {
    if (!token) {
      setStatusMessage({
        type: "error",
        text: "Invalid or missing token. Please request a new password reset link.",
      });
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    if (formData.password !== formData.confirmPassword) {
      setStatusMessage({ type: "error", text: "Passwords do not match" });
      return;
    }

    if (formData.password.length < 4) {
      setStatusMessage({
        type: "error",
        text: "Password must be at least 4 characters long",
      });
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);

    try {
      const res = await axios.post("/api/auth/reset-password", {
        token,
        password: formData.password,
      });

      setStatusMessage({ type: "success", text: res.data.message });

      // Redirect to login after 3 seconds
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
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight mb-2">
              Set New Password
            </h1>
            <p className="text-sm text-gray-500">
              Please enter your new password below.
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

            <div className="space-y-5">
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2"
                >
                  New Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 pr-12 text-sm outline-none transition-all focus:border-black focus:bg-white focus:ring-1 focus:ring-black"
                    placeholder="••••••••"
                    disabled={!token}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <FiEyeOff className="w-4 h-4" />
                    ) : (
                      <FiEye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2"
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3.5 pr-12 text-sm outline-none transition-all focus:border-black focus:bg-white focus:ring-1 focus:ring-black"
                    placeholder="••••••••"
                    disabled={!token}
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !token}
              className="w-full bg-black text-white text-xs font-bold uppercase tracking-widest py-4 rounded-xl hover:bg-gray-800 transition-all active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 group"
            >
              {isLoading ? (
                "Resetting..."
              ) : (
                <>
                  Reset Password
                  <FiArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center border-t border-gray-100 pt-6">
            <p className="text-sm text-gray-500">
              <Link
                href="/auth/signin"
                className="font-bold text-black hover:underline"
              >
                Back to Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
