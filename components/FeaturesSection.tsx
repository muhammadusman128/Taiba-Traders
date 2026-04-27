"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import { Playfair_Display, Dancing_Script, Inter } from "next/font/google";
import {
  FiPrinter, FiLayers, FiMonitor, FiPackage,
  FiStar, FiZap, FiShield, FiTruck, FiAward,
  FiGrid, FiBox, FiSettings,
} from "react-icons/fi";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["700", "800", "900"] });
const dancing = Dancing_Script({ subsets: ["latin"], weight: ["700"] });
const inter = Inter({ subsets: ["latin"], weight: ["300", "400", "500"] });

const ICON_MAP: Record<string, React.ReactNode> = {
  printer:  <FiPrinter  size={36} />,
  layers:   <FiLayers   size={36} />,
  monitor:  <FiMonitor  size={36} />,
  package:  <FiPackage  size={36} />,
  star:     <FiStar     size={36} />,
  zap:      <FiZap      size={36} />,
  shield:   <FiShield   size={36} />,
  truck:    <FiTruck    size={36} />,
  award:    <FiAward    size={36} />,
  grid:     <FiGrid     size={36} />,
  box:      <FiBox      size={36} />,
  settings: <FiSettings size={36} />,
};

interface Card { icon: string; title: string; }
interface FeaturesData {
  isActive: boolean;
  leftBgColor: string;
  leftBgGradient: string;
  rightBgColor: string;
  accentColor: string;
  headingColor: string;
  textColor: string;
  buttonBgColor: string;
  buttonTextColor: string;
  preHeadline: string;
  heading: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  cards: Card[];
}

export default function FeaturesSection() {
  const [data, setData] = useState<FeaturesData | null>(null);

  useEffect(() => {
    axios.get("/api/settings/features")
      .then(r => setData(r.data))
      .catch(() => {});
  }, []);

  if (!data || !data.isActive) return null;

  return (
    <section className={`w-full flex flex-col md:flex-row min-h-[440px] mt-10 ${inter.className}`}>

      {/* ── LEFT: Colored grid ── */}
      <div
        className="flex-1 relative p-8 sm:p-12 flex items-center justify-center overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${data.leftBgColor} 0%, ${data.leftBgGradient} 100%)`,
        }}
      >
        {/* subtle dot pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
        <div className="relative z-10 grid grid-cols-2 gap-4 w-full max-w-sm">
          {data.cards.slice(0, 4).map((card, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center gap-3 p-5 text-center rounded-xl border border-white/25 bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300"
            >
              <span className="text-white opacity-90">
                {ICON_MAP[card.icon] ?? <FiGrid size={36} />}
              </span>
              <p className="text-white text-xs font-semibold uppercase tracking-widest leading-tight">
                {card.title}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT: Text ── */}
      <div
        className="flex-1 flex items-center justify-center px-10 sm:px-16 py-14"
        style={{ backgroundColor: data.rightBgColor }}
      >
        <div className="max-w-md space-y-5 text-center md:text-left">
          {data.preHeadline && (
            <p
              className={`text-lg font-bold ${dancing.className}`}
              style={{ color: data.accentColor }}
            >
              {data.preHeadline}
            </p>
          )}
          {data.heading && (
            <h2
              className={`text-4xl sm:text-5xl font-black leading-tight tracking-tight uppercase ${playfair.className}`}
              style={{ color: data.headingColor }}
            >
              {data.heading}
            </h2>
          )}
          {data.description && (
            <p
              className="text-sm leading-relaxed"
              style={{ color: data.textColor }}
            >
              {data.description}
            </p>
          )}
          {data.buttonText && data.buttonLink && (
            <Link
              href={data.buttonLink}
              className="inline-block mt-2 px-8 py-3 text-sm font-bold uppercase tracking-widest rounded-full transition-all duration-300 hover:opacity-80 active:scale-95"
              style={{
                backgroundColor: data.buttonBgColor,
                color: data.buttonTextColor,
              }}
            >
              {data.buttonText}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
