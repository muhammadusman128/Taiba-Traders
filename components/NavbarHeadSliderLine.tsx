"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

export default function NavbarHeadSliderLine({
  isFooter = false,
}: {
  isFooter?: boolean;
}) {
  const [text, setText] = useState("DEAL IN TEXTILES ACCESSORIES AND GARMENTS");
  const [isActive, setIsActive] = useState(false);
  const [bgColor, setBgColor] = useState("#000000");
  const [textColor, setTextColor] = useState("#ffffff");

  useEffect(() => {
    let mounted = true;
    axios
      .get("/api/banner")
      .then((res) => {
        if (!mounted) return;
        if (res.data?.text) setText(res.data.text);
        if (res.data?.isActive !== undefined) setIsActive(res.data.isActive);
        if (res.data?.bgColor) setBgColor(res.data.bgColor);
        if (res.data?.textColor) setTextColor(res.data.textColor);
      })
      .catch(() => {
        // ignore, keep default
      });
    return () => {
      mounted = false;
    };
  }, []);

  if (!isFooter) {
    if (!isActive) return null;
    return (
      <div 
        className="h-7 flex w-full items-center justify-center overflow-hidden"
        style={{ backgroundColor: bgColor }}
      >
        <span 
          className="text-[10px] uppercase tracking-[0.2em] font-bold px-4"
          style={{ color: textColor }}
        >
          {text}
        </span>
      </div>
    );
  }

  return (
    <div 
      className="h-7 flex items-center overflow-hidden whitespace-nowrap"
      style={{ backgroundColor: bgColor }}
    >
      <div 
        className="animate-marquee flex gap-10 whitespace-nowrap text-[10px] uppercase tracking-[0.2em] font-bold"
        style={{ color: textColor }}
      >
        {/* Repeat text multiple times to create a seamless scrolling loop */}
        <span>{text}</span>
        <span>{text}</span>
        <span>{text}</span>
        <span>{text}</span>
        <span>{text}</span>
        <span>{text}</span>
        <span>{text}</span>
        <span>{text}</span>
        <span>{text}</span>
        <span>{text}</span>
      </div>
      <div
        className="animate-marquee flex gap-10 whitespace-nowrap text-[10px] uppercase tracking-[0.2em] font-bold"
        aria-hidden="true"
        style={{ color: textColor }}
      >
        <span>{text}</span>
        <span>{text}</span>
        <span>{text}</span>
        <span>{text}</span>
        <span>{text}</span>
        <span>{text}</span>
        <span>{text}</span>
        <span>{text}</span>
        <span>{text}</span>
        <span>{text}</span>
      </div>
    </div>
  );
}
