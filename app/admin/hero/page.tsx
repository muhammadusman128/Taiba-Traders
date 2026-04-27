"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import LocalImageUpload from "@/components/LocalImageUpload";
import {
  FiEye,
  FiEyeOff,
  FiLayout,
  FiImage,
  FiType,
  FiLink,
} from "react-icons/fi";

const layouts = [
  { value: "split", label: "Split (Text + Image)" },
  { value: "centered", label: "Centered (Text only)" },
  { value: "fullbg", label: "Full Background Image" },
];

const imagePositions = [
  { value: "right", label: "Image Right" },
  { value: "left", label: "Image Left" },
];

export default function HeroAdminPage() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [preview, setPreview] = useState(false);

  const [form, setForm] = useState({
    preHeadline: "",
    headline: "",
    subtitle: "",
    buttonText: "",
    buttonLink: "",
    secondButtonText: "",
    secondButtonLink: "",
    image: "",
    bgColor: "#2d2db5",
    bgGradientColor: "#1a1a6e",
    accentColor: "#e91e8c",
    textColor: "#ffffff",
    overlayOpacity: 40,
    layout: "split",
    imagePosition: "right",
    isActive: false,
  });

  useEffect(() => {
    const fetchHero = async () => {
      try {
        const { data } = await axios.get("/api/settings/hero");
        setForm({
          preHeadline: data.preHeadline || "",
          headline: data.headline || "",
          subtitle: data.subtitle || "",
          buttonText: data.buttonText || "",
          buttonLink: data.buttonLink || "",
          secondButtonText: data.secondButtonText || "",
          secondButtonLink: data.secondButtonLink || "",
          image: data.image || "",
          bgColor: data.bgColor || "#2d2db5",
          bgGradientColor: data.bgGradientColor || "#1a1a6e",
          accentColor: data.accentColor || "#e91e8c",
          textColor: data.textColor || "#ffffff",
          overlayOpacity: data.overlayOpacity ?? 40,
          layout: data.layout || "split",
          imagePosition: data.imagePosition || "right",
          isActive: data.isActive ?? false,
        });
      } catch {
        toast.error("Failed to load hero settings");
      } finally {
        setFetching(false);
      }
    };
    fetchHero();
  }, []);

  const set = (key: string, value: any) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put("/api/settings/hero", form);
      toast.success("Hero section saved!");
    } catch {
      toast.error("Failed to save hero settings");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="w-6 h-6 border-2 border-zinc-300 border-t-zinc-800 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Header */}
      <div className="border-b border-gray-200 pb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-light text-gray-900 tracking-tight">
            Hero Section
          </h1>
          <p className="text-sm text-gray-400 mt-1 font-light">
            Customize the main hero banner shown on your homepage
          </p>
        </div>

        {/* Active toggle */}
        <div className="flex items-center gap-3 pt-1">
          <span className="text-xs font-medium uppercase tracking-widest text-gray-500">
            {form.isActive ? "Active" : "Hidden"}
          </span>
          <button
            type="button"
            onClick={() => set("isActive", !form.isActive)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none ${
              form.isActive ? "bg-black" : "bg-gray-200"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
                form.isActive ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Live Preview Toggle */}
      <button
        type="button"
        onClick={() => setPreview(!preview)}
        className="flex items-center gap-2 text-xs uppercase tracking-widest font-medium text-gray-500 hover:text-black transition-colors"
      >
        {preview ? <FiEyeOff size={14} /> : <FiEye size={14} />}
        {preview ? "Hide Preview" : "Show Live Preview"}
      </button>

      {/* Preview */}
      {preview && (
        <div
          className="w-full rounded-xl overflow-hidden border border-gray-100 relative"
          style={{
            backgroundColor:
              form.layout === "fullbg" && form.image
                ? "transparent"
                : form.bgColor,
            minHeight: 260,
          }}
        >
          {form.layout === "fullbg" && form.image && (
            <>
              <img
                src={form.image}
                alt="bg"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{
                  backgroundColor: `rgba(0,0,0,${form.overlayOpacity / 100})`,
                }}
              />
            </>
          )}
          <div
            className={`relative z-10 flex items-center h-full p-10 gap-8 ${
              form.layout === "centered"
                ? "flex-col text-center justify-center"
                : form.imagePosition === "left"
                  ? "flex-row-reverse"
                  : "flex-row"
            }`}
          >
            <div className="flex-1 space-y-4">
              {form.headline && (
                <h2
                  className="text-3xl font-bold leading-tight"
                  style={{ color: form.textColor }}
                >
                  {form.headline}
                </h2>
              )}
              {form.subtitle && (
                <p
                  className="text-base font-light"
                  style={{ color: form.textColor, opacity: 0.8 }}
                >
                  {form.subtitle}
                </p>
              )}
              {form.buttonText && (
                <div
                  className="inline-block px-6 py-2.5 text-sm font-medium uppercase tracking-widest border"
                  style={{
                    borderColor: form.textColor,
                    color: form.textColor,
                  }}
                >
                  {form.buttonText}
                </div>
              )}
            </div>
            {form.layout !== "fullbg" && form.image && (
              <div className="flex-1 h-40 relative rounded-lg overflow-hidden">
                <img
                  src={form.image}
                  alt="hero"
                  className="w-full h-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Layout */}
        <section>
          <SectionTitle icon={<FiLayout size={14} />} label="Layout" />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
            {layouts.map((l) => (
              <button
                key={l.value}
                type="button"
                onClick={() => set("layout", l.value)}
                className={`px-4 py-3 text-xs uppercase tracking-widest font-medium border transition-all ${
                  form.layout === l.value
                    ? "bg-black text-white border-black"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
          {form.layout === "split" && (
            <div className="grid grid-cols-2 gap-3 mt-3">
              {imagePositions.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => set("imagePosition", p.value)}
                  className={`px-4 py-2.5 text-xs uppercase tracking-widest font-medium border transition-all ${
                    form.imagePosition === p.value
                      ? "bg-black text-white border-black"
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-400"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}
        </section>

        {/* Text */}
        <section>
          <SectionTitle icon={<FiType size={14} />} label="Text Content" />
          <div className="space-y-6 mt-4">
            <Field label="Pre-Headline (Small Label Above Title)">
              <input
                type="text"
                value={form.preHeadline}
                onChange={(e) => set("preHeadline", e.target.value)}
                className="w-full bg-transparent border-0 border-b border-gray-200 py-3 text-sm focus:ring-0 focus:border-black transition-colors px-0 font-light"
                placeholder="e.g. Enjoy our professional"
              />
            </Field>
            <Field label="Main Headline">
              <input
                type="text"
                value={form.headline}
                onChange={(e) => set("headline", e.target.value)}
                className="w-full bg-transparent border-0 border-b border-gray-200 py-3 text-sm focus:ring-0 focus:border-black transition-colors px-0 font-light"
                placeholder="e.g. Printing Services"
              />
            </Field>
            <Field label="Subtitle">
              <textarea
                value={form.subtitle}
                onChange={(e) => set("subtitle", e.target.value)}
                rows={3}
                className="w-full bg-transparent border-0 border-b border-gray-200 py-3 text-sm focus:ring-0 focus:border-black transition-colors px-0 font-light resize-none"
                placeholder="We specialize in commercial offset printing..."
              />
            </Field>
          </div>
        </section>

        {/* Button */}
        <section>
          <SectionTitle icon={<FiLink size={14} />} label="Call to Action Button" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            <Field label="Primary Button Text">
              <input
                type="text"
                value={form.buttonText}
                onChange={(e) => set("buttonText", e.target.value)}
                className="w-full bg-transparent border-0 border-b border-gray-200 py-3 text-sm focus:ring-0 focus:border-black transition-colors px-0 font-light"
                placeholder="e.g. Get a Quote"
              />
            </Field>
            <Field label="Primary Button Link">
              <input
                type="text"
                value={form.buttonLink}
                onChange={(e) => set("buttonLink", e.target.value)}
                className="w-full bg-transparent border-0 border-b border-gray-200 py-3 text-sm focus:ring-0 focus:border-black transition-colors px-0 font-light"
                placeholder="e.g. /contact"
              />
            </Field>
            <Field label="Secondary Button Text">
              <input
                type="text"
                value={form.secondButtonText}
                onChange={(e) => set("secondButtonText", e.target.value)}
                className="w-full bg-transparent border-0 border-b border-gray-200 py-3 text-sm focus:ring-0 focus:border-black transition-colors px-0 font-light"
                placeholder="e.g. Find Locations"
              />
            </Field>
            <Field label="Secondary Button Link">
              <input
                type="text"
                value={form.secondButtonLink}
                onChange={(e) => set("secondButtonLink", e.target.value)}
                className="w-full bg-transparent border-0 border-b border-gray-200 py-3 text-sm focus:ring-0 focus:border-black transition-colors px-0 font-light"
                placeholder="e.g. /locations"
              />
            </Field>
          </div>
        </section>

        {/* Colors */}
        <section>
          <SectionTitle icon={<span className="text-xs">🎨</span>} label="Colors" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mt-4">
            <Field label="Background Color (Gradient Start)">
              <div className="flex items-center gap-3 pt-2">
                <input type="color" value={form.bgColor}
                  onChange={(e) => set("bgColor", e.target.value)}
                  className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5 bg-white" />
                <input type="text" value={form.bgColor}
                  onChange={(e) => set("bgColor", e.target.value)}
                  className="flex-1 bg-transparent border-0 border-b border-gray-200 py-2 text-sm focus:ring-0 focus:border-black transition-colors px-0 font-mono" />
              </div>
            </Field>
            <Field label="Gradient End Color">
              <div className="flex items-center gap-3 pt-2">
                <input type="color" value={(form as any).bgGradientColor || "#1a1a6e"}
                  onChange={(e) => set("bgGradientColor", e.target.value)}
                  className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5 bg-white" />
                <input type="text" value={(form as any).bgGradientColor || "#1a1a6e"}
                  onChange={(e) => set("bgGradientColor", e.target.value)}
                  className="flex-1 bg-transparent border-0 border-b border-gray-200 py-2 text-sm focus:ring-0 focus:border-black transition-colors px-0 font-mono" />
              </div>
            </Field>
            <Field label="Text Color">
              <div className="flex items-center gap-3 pt-2">
                <input type="color" value={form.textColor}
                  onChange={(e) => set("textColor", e.target.value)}
                  className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5 bg-white" />
                <input type="text" value={form.textColor}
                  onChange={(e) => set("textColor", e.target.value)}
                  className="flex-1 bg-transparent border-0 border-b border-gray-200 py-2 text-sm focus:ring-0 focus:border-black transition-colors px-0 font-mono" />
              </div>
            </Field>
            <Field label="Accent / Button Color">
              <div className="flex items-center gap-3 pt-2">
                <input type="color" value={(form as any).accentColor || "#e91e8c"}
                  onChange={(e) => set("accentColor", e.target.value)}
                  className="w-10 h-10 rounded-lg border border-gray-200 cursor-pointer p-0.5 bg-white" />
                <input type="text" value={(form as any).accentColor || "#e91e8c"}
                  onChange={(e) => set("accentColor", e.target.value)}
                  className="flex-1 bg-transparent border-0 border-b border-gray-200 py-2 text-sm focus:ring-0 focus:border-black transition-colors px-0 font-mono" />
              </div>
              <p className="text-[10px] text-gray-400 mt-1">Used for primary button and highlights</p>
            </Field>
          </div>
          {form.layout === "fullbg" && (
            <div className="mt-6">
              <Field
                label={`Dark Overlay Opacity — ${form.overlayOpacity}%`}
              >
                <input
                  type="range"
                  min={0}
                  max={90}
                  step={5}
                  value={form.overlayOpacity}
                  onChange={(e) =>
                    set("overlayOpacity", Number(e.target.value))
                  }
                  className="w-full mt-3 accent-black"
                />
              </Field>
            </div>
          )}
        </section>

        {/* Image */}
        <section>
          <SectionTitle icon={<FiImage size={14} />} label="Hero Image" />
          <p className="text-xs text-gray-400 font-light mt-1 mb-4">
            {form.layout === "fullbg"
              ? "Used as full background image"
              : "Shown on the side in split layout"}
          </p>
          <div className="max-w-sm">
            <LocalImageUpload
              value={form.image}
              onChange={(url) => set("image", url)}
              onRemove={() => set("image", "")}
            />
          </div>
        </section>

        {/* Submit */}
        <div className="pt-4 border-t border-gray-100">
          <button
            type="submit"
            disabled={loading}
            className="px-8 py-3 bg-black cursor-pointer text-white text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors uppercase tracking-widest"
          >
            {loading ? "Saving..." : "Save Hero Section"}
          </button>
        </div>
      </form>
    </div>
  );
}

function SectionTitle({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-gray-400">{icon}</span>
      <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400">
        {label}
      </h2>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-900 uppercase tracking-widest mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}
