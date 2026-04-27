"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { FiArrowRight, FiArrowLeft, FiEye, FiEyeOff } from "react-icons/fi";

export default function AdminSignInPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
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
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
        loginType: "admin",
      });

      if (result?.ok) {
        setStatusMessage({
          type: "success",
          text: "Admin securely signed in! Redirecting...",
        });
        setTimeout(() => {
          router.push("/admin");
          router.refresh();
        }, 1000);
      } else if (result?.error) {
        setStatusMessage({ type: "error", text: result.error });
      }
    } catch (error: any) {
      setStatusMessage({
        type: "error",
        text: "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex bg-white h-screen w-full flex-col md:flex-row overflow-hidden">
      {/* Left Side - Brand Display (Fixed background style) */}
      <div className="relative w-full md:w-2/5 bg-green-800 text-white p-8 md:p-12 flex flex-col justify-between hidden md:flex h-full overflow-hidden">
        {/* Abstract green shapes / gradient */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[50%] rounded-full bg-green-800/40 blur-[80px]"></div>
          <div className="absolute bottom-[10%] -right-[20%] w-[60%] h-[60%] rounded-full bg-green-600/20 blur-[100px]"></div>
        </div>

        <div className="relative z-10 flex items-center justify-start">
          <button
            onClick={() => router.push("/")}
            className="p-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-all backdrop-blur-sm"
            title="Return to Home"
          >
            <FiArrowLeft className="w-5 h-5" />
          </button>
        </div>

        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="flex justify-center border-4 border-white/20 rounded-sm p-2 bg-white mb-6">
            <Image
              src="/logomain.png"
              alt="Taiba Traders logo"
              width={72}
              height={72}
              className="rounded-sm"
              priority
            />
          </div>

          <p className="text-white/70 text-base leading-relaxed max-w-md">
            Log in to manage your store, track active sessions, oversee users,
            and control contents cleanly securely.
          </p>
        </div>

        <div className="relative z-10 text-sm text-white/50 font-medium tracking-wide text-center">
          © {new Date().getFullYear()} TaibaTraders
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full md:w-3/5 p-6 sm:p-10 md:p-16 lg:p-24 flex flex-col justify-center bg-white h-full overflow-y-auto">
        {/* Mobile Header (Only visible on small screens) */}
        <div className="md:hidden flex items-center justify-between mb-10 w-full max-w-md mx-auto">
          <button
            onClick={() => router.push("/")}
            className="p-2 text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 rounded-full transition-all"
            title="Return to Home"
          >
            <FiArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex justify-center border border-gray-100 rounded-sm p-1 bg-white shadow-sm">
            <Image
              src="/logomain.png"
              alt="Taiba Traders logo"
              width={40}
              height={40}
              className="rounded-full"
              priority
            />
          </div>
        </div>

        <div className="w-full max-w-md mx-auto">
          <div className="mb-10">
            <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
              Welcome back
            </h1>
            <p className="text-gray-500 mt-2 text-sm">
              Please enter your admin credentials to continue.
            </p>
          </div>

          {statusMessage ? (
            <div
              className={`mb-6 p-4 text-sm ${statusMessage.type === "error"
                ? "bg-red-50 text-red-600"
                : "bg-green-50 text-green-600"
                }`}
            >
              <span className="font-medium">{statusMessage.text}</span>
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-900"
              >
                Email Address
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-transparent focus:border-green-700 focus:ring-1 focus:ring-green-700 outline-none transition-all duration-200 placeholder-gray-400 text-gray-900"
                placeholder="admin@example.com"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-900"
                >
                  Password
                </label>
              </div>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-transparent focus:border-green-700 focus:ring-1 focus:ring-green-700 outline-none transition-all duration-200 pr-10 placeholder-gray-400 text-gray-900"
                  placeholder="••••••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-green-700 focus:outline-none transition-colors"
                >
                  {showPassword ? (
                    <FiEyeOff className="h-4 w-4" />
                  ) : (
                    <FiEye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-8 bg-green-700 text-white font-medium py-3 hover:bg-green-800 transition-colors duration-200 disabled:opacity-60 cursor-pointer disabled:cursor-wait flex items-center justify-center gap-2 rounded-lg shadow-md hover:shadow-lg"
            >
              {isLoading ? "Authenticating..." : "Sign In"}
              {isLoading ? (
                <span
                  className="h-4 w-4 border-2 border-white/40 border-t-white rounded-full animate-spin"
                  aria-hidden="true"
                />
              ) : (
                <FiArrowRight size={16} />
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
