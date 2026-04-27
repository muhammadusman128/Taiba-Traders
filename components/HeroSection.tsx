"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { Playfair_Display, Inter, Dancing_Script } from "next/font/google";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["700", "800", "900"] });
const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500", "600"] });
const dancing = Dancing_Script({ subsets: ["latin"], weight: ["700"] });

interface HeroData {
  preHeadline: string;
  headline: string;
  subtitle: string;
  buttonText: string;
  buttonLink: string;
  secondButtonText: string;
  secondButtonLink: string;
  image: string;
  bgColor: string;
  bgGradientColor: string;
  accentColor: string;
  textColor: string;
  overlayOpacity: number;
  layout: string;
  imagePosition: string;
  isActive: boolean;
}

export default function HeroSection() {
  const [hero, setHero] = useState<HeroData | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    axios
      .get("/api/settings/hero")
      .then(({ data }) => setHero(data))
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    if (!loaded || !hero?.isActive) return;
    const timer = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(timer);
  }, [loaded, hero]);

  if (!loaded || !hero || !hero.isActive) return null;

  const isFullBg = hero.layout === "fullbg";
  const isCentered = hero.layout === "centered";
  const isImageLeft = hero.imagePosition === "left";

  const bg = hero.bgGradientColor
    ? `linear-gradient(135deg, ${hero.bgColor} 0%, ${hero.bgGradientColor} 100%)`
    : hero.bgColor;

  const accent = hero.accentColor || "#e91e8c";

  return (
    <section
      className={`w-full relative overflow-hidden rounded-3xl ${inter.className}`}
      style={{
        background: isFullBg ? undefined : bg,
        minHeight: "480px",
        margin: "0 1rem",
        width: "calc(100% - 2rem)",
      }}
    >
      {/* Full BG Image */}
      {isFullBg && hero.image && (
        <>
          <img src={hero.image} alt={hero.headline || "Hero"}
            className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0"
            style={{ backgroundColor: `rgba(0,0,0,${(hero.overlayOpacity ?? 40) / 100})` }} />
        </>
      )}

      {/* Dot Pattern */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle, ${hero.textColor}22 1.5px, transparent 1.5px)`,
          backgroundSize: "26px 26px",
          animation: "dotsDrift 20s linear infinite",
        }}
      />

      {/* Glow blobs */}
      <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full pointer-events-none"
        style={{ background: `${accent}18`, filter: "blur(80px)" }} />
      <div className="absolute -bottom-20 right-10 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: `${hero.bgColor}30`, filter: "blur(100px)" }} />

      {/* Main Layout */}
      <div
        className={`relative z-10 w-full px-10 sm:px-20 lg:px-28 py-16 sm:py-24 flex gap-12 items-center ${
          isCentered
            ? "flex-col text-center justify-center"
            : isImageLeft
              ? "flex-col md:flex-row-reverse"
              : "flex-col md:flex-row"
        }`}
      >
        {/* ── Text Block ── */}
        <div
          className={`flex-1 space-y-6 ${isCentered ? "max-w-3xl" : ""} transition-all duration-700 ease-out ${
            visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-16"
          }`}
        >
          {/* Pre-headline — stylish Dancing Script */}
          {hero.preHeadline && (
            <div className="inline-block relative pb-1">
              <span
                className={`text-2xl sm:text-3xl italic ${dancing.className}`}
                style={{
                  color: accent,
                  textShadow: `0 0 24px ${accent}66`,
                  letterSpacing: "0.02em",
                }}
              >
                {hero.preHeadline}
              </span>
              <span
                className="absolute -bottom-0.5 left-0 w-3/4 h-[2px] rounded-full"
                style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }}
              />
            </div>
          )}

          {/* Main Headline */}
          {hero.headline && (
            <h1
              className={`text-5xl sm:text-6xl lg:text-7xl font-bold leading-[1.1] ${dancing.className}`}
              style={{ color: hero.textColor }}
            >
              {hero.headline}
            </h1>
          )}

          {/* Subtitle */}
          {hero.subtitle && (
            <p
              className="text-base sm:text-lg font-light leading-relaxed max-w-lg"
              style={{ color: hero.textColor, opacity: 0.75 }}
            >
              {hero.subtitle}
            </p>
          )}

          {/* Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            {hero.buttonText && hero.buttonLink && (
              <Link
                href={hero.buttonLink}
                className="inline-flex items-center gap-2 px-7 py-3 text-sm font-bold uppercase tracking-widest rounded-full transition-all duration-300 hover:brightness-110 active:scale-95 shadow-lg"
                style={{
                  backgroundColor: accent,
                  color: "#fff",
                  boxShadow: `0 6px 24px ${accent}55`,
                }}
              >
                {hero.buttonText}
              </Link>
            )}
            {hero.secondButtonText && hero.secondButtonLink && (
              <Link
                href={hero.secondButtonLink}
                className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest transition-all duration-300 hover:gap-3 active:scale-95"
                style={{ color: hero.textColor }}
              >
                {hero.secondButtonText}
                <span
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ backgroundColor: `${hero.textColor}20`, border: `1.5px solid ${hero.textColor}40` }}
                >
                  →
                </span>
              </Link>
            )}
          </div>

        </div>

        {/* ── Side Image ── */}
        {!isFullBg && !isCentered && hero.image && (
          <div
            className={`shrink-0 transition-all duration-700 ease-out delay-200 ${
              visible ? "opacity-100 translate-x-0 scale-100" : "opacity-0 translate-x-12 scale-95"
            }`}
          >
            <img
              src={hero.image}
              alt={hero.headline || "Hero"}
              className="object-contain drop-shadow-2xl"
              style={{ maxWidth: "440px", maxHeight: "400px", width: "auto", height: "auto" }}
            />
          </div>
        )}
      </div>

      <style>{`
        @keyframes dotsDrift {
          0%   { background-position: 0 0; }
          100% { background-position: 52px 52px; }
        }
      `}</style>
    </section>
  );
}
