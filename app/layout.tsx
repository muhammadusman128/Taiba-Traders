import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import ConditionalFooterAndSlider from "@/components/ConditionalFooterAndSlider";
import ThemeProvider from "@/components/ThemeProvider";
import AuthProvider from "@/components/AuthProvider";
import CartDrawer from "@/components/CartDrawer";
import ChatWidget from "@/components/ChatWidget";
import SitePopup from "@/components/SitePopup";
import VisitorTracker from "@/components/VisitorTracker";
import { Toaster } from "sonner";
import connectDB from "@/lib/mongodb";
import Setting from "@/models/Setting";

// Disable Next.js caching across the app so every request fetches fresh data.
export const fetchCache = "force-no-store";
export const dynamic = "force-dynamic";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
const companyName = "Taiba Traders";
const companyFullName = "Taiba Traders";
const companyTagline =
  "Pakistan's Trusted Online Clothing Brand for Quality Products";
const companyDescription =
  "Taiba Traders, provide a wide range of quality products to meet your needs.";
const logoPath = "/logo.png";
const faviconPath = "/logo.png";
const logoUrl = new URL(logoPath, siteUrl).toString();

const outfit = Outfit({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  let dynamicFavicon = faviconPath;
  let dynamicSiteName = companyName;
  let dynamicSiteTagline = companyTagline;
  let dynamicSiteDescription = companyDescription;

  try {
    await connectDB();
    const siteSettings = await Setting.findOne({ key: "site" });
    if (siteSettings?.value) {
      if (siteSettings.value.favicon)
        dynamicFavicon = siteSettings.value.favicon;
      if (siteSettings.value.siteName)
        dynamicSiteName = siteSettings.value.siteName;
      if (siteSettings.value.siteTagline)
        dynamicSiteTagline = siteSettings.value.siteTagline;
      if (siteSettings.value.siteDescription)
        dynamicSiteDescription = siteSettings.value.siteDescription;
    }
  } catch (error) {
    console.error("Failed to fetch favicon metadata", error);
  }

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: `${dynamicSiteName} | ${dynamicSiteTagline}`,
      template: `%s | ${dynamicSiteName}`,
    },
    description: dynamicSiteDescription,
    keywords: [
      dynamicSiteName.toLowerCase(),
      companyFullName.toLowerCase(),
      "ecommerce",
      "online shopping",
      "featured products",
      "secure checkout",
      "Taiba Traders",
      "quality products",
      "trusted source",
      "clothing",
      "loan suits",
      "men's fashion",
      "ladies fashion",
      "bacho k kapray",
    ],
    applicationName: dynamicSiteName,
    authors: [{ name: dynamicSiteName }],
    creator: dynamicSiteName,
    publisher: dynamicSiteName,
    category: "shopping",
    alternates: {
      canonical: "/",
    },
    openGraph: {
      title: `${dynamicSiteName} | ${dynamicSiteTagline}`,
      description: dynamicSiteDescription,
      url: siteUrl,
      siteName: dynamicSiteName,
      images: [
        {
          url: logoUrl,
          width: 512,
          height: 512,
          alt: dynamicSiteName,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${dynamicSiteName} | ${dynamicSiteTagline}`,
      description: dynamicSiteDescription,
      images: [logoUrl],
    },
    icons: {
      icon: dynamicFavicon,
      shortcut: dynamicFavicon,
      apple: dynamicFavicon,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let themeData = null;
  let siteSettings = null;

  try {
    await connectDB();
    const [themeDoc, siteDoc] = await Promise.all([
      Setting.findOne({ key: "theme_colors" }),
      Setting.findOne({ key: "site" }),
    ]);
    if (themeDoc) {
      themeData = themeDoc.value;
    }
    if (siteDoc) {
      siteSettings = siteDoc.value;
    }
  } catch (error) {
    console.error("Failed to load layout theme", error);
  }

  const primaryColor = themeData?.primaryColor || "#000000";
  const headingColor = themeData?.headingColor || "#000000";
  const textColor = themeData?.textColor || "#374151";
  const buttonBgColor = themeData?.buttonBgColor || "#000000";
  const buttonTextColor = themeData?.buttonTextColor || "#ffffff";
  const backgroundColor = themeData?.backgroundColor || "#ffffff";
  const footerBgColor = themeData?.footerBgColor || "#ffffff";
  const footerTextColor = themeData?.footerTextColor || "#374151";

  const siteLogo = siteSettings?.logo || "/logomain.png";
  const siteFavicon = siteSettings?.favicon || "/logo.png";

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: siteSettings?.siteName || companyFullName,
              url: siteUrl,
              logo: siteLogo,
            }),
          }}
        />
        <link rel="icon" href={siteFavicon} />
        <link rel="apple-touch-icon" href={siteFavicon} />
        <link rel="shortcut icon" href={siteFavicon} />
        <style
          dangerouslySetInnerHTML={{
            __html: `
            :root {
              --primary-color: ${primaryColor};
              --heading-color: ${headingColor};
              --text-color: ${textColor};
              --btn-bg: ${buttonBgColor};
              --btn-text: ${buttonTextColor};
              --background-color: ${backgroundColor};
              --footer-bg: ${footerBgColor};
              --footer-text: ${footerTextColor};
            }
          `,
          }}
        />
      </head>
      <body
        className={`${outfit.className} overflow-x-hidden`}
        suppressHydrationWarning
      >
        <AuthProvider>
          <Toaster richColors position="top-center" />
          <ThemeProvider />
          <CartDrawer />
          <ChatWidget />
          <SitePopup />
          <VisitorTracker />

          <div className="flex flex-col min-h-screen">
            <Navbar initialLogo={siteLogo} />
            <main className="grow">{children}</main>
            <ConditionalFooterAndSlider />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
