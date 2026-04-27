"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import Sidebar from "./AdminSidebar";
import { Toaster } from "react-hot-toast";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (
      status === "unauthenticated" ||
      (session && session.user.role !== "admin")
    ) {
      router.push("/");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center bg-[#fafafa]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!session || session.user.role !== "admin") {
    return null;
  }

  return (
    <div className="flex h-[100dvh] overflow-hidden bg-[#fafafa] relative selection:bg-zinc-200 selection:text-black">
      <Toaster position="top-right" />
      <Sidebar />
      <div className="flex-1 overflow-y-auto w-full">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 md:pl-10">
          <div className="mb-8 md:mb-10 flex flex-col items-start gap-1 mt-16 md:mt-2">
            <button
              onClick={() => router.back()}
              className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-zinc-400 hover:text-black transition-colors cursor-pointer mb-2"
              title="Go back"
            >
              <FiArrowLeft size={14} strokeWidth={2.5} />
              Back
            </button>
            <div>
              <h1 className="text-3xl md:text-4xl font-light tracking-tight text-zinc-900 border-b-2 border-black inline-block pb-1">
                Admin Workspace
              </h1>
            </div>
          </div>

          <div className="pb-24">{children}</div>
        </div>
      </div>
    </div>
  );
}
