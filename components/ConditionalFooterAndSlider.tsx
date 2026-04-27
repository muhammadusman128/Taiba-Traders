"use client";

import { usePathname } from "next/navigation";
import Footer from "./Footer";
import NavbarHeadSliderLine from "./NavbarHeadSliderLine";

export default function ConditionalFooterAndSlider() {
  const pathname = usePathname();

  // Hide on admin routes
  if (
    pathname?.startsWith("/admin") ||
    pathname?.startsWith("/auth") ||
    pathname?.startsWith("/search")
  ) {
    return null;
  }

  return (
    <>
      <Footer />
    </>
  );
}
