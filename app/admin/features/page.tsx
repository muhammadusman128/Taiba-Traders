"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const ICON_OPTIONS = [
  { value: "printer",  label: "🖨 Printer" },
  { value: "layers",   label: "🗂 Layers" },
  { value: "monitor",  label: "🖥 Monitor" },
  { value: "package",  label: "📦 Package" },
  { value: "star",     label: "⭐ Star" },
  { value: "zap",      label: "⚡ Zap" },
  { value: "shield",   label: "🛡 Shield" },
  { value: "truck",    label: "🚚 Truck" },
  { value: "award",    label: "🏆 Award" },
  { value: "grid",     label: "⊞ Grid" },
  { value: "box",      label: "📫 Box" },
  { value: "settings", label: "⚙ Settings" },
];

const defaultCards = [
  { icon: "printer", title: "Offset Printing Solutions" },
  { icon: "layers",  title: "Graphic Designing Services" },
  { icon: "monitor", title: "Digital Printing Solutions" },
  { icon: "package", title: "Custom Packaging Solutions" },
];

export default function FeaturesAdminPage() {
  const [loading, setLoading]   = useState(false);
  const [fetching, setFetching] = useState(true);

  const [form, setForm] = useState({
    isActive: false,
    leftBgColor:     "#00bcd4",
    leftBgGradient:  "#0097a7",
    rightBgColor:    "#f4f4f4",
    accentColor:     "#00bcd4",
    headingColor:    "#111827",
    textColor:       "#555555",
    buttonBgColor:   "#111827",
    buttonTextColor: "#ffffff",
    preHeadline: "Provide Quality",
    heading:     "Print Services",
    description: "We host all premium instrumentation from one color duplication and 2 colors printing to 6 and eight color presses.",
    buttonText: "More Info",
    buttonLink: "/products",
    cards: defaultCards,
  });

  useEffect(() => {
    axios.get("/api/settings/features")
      .then(({ data }) => {
        setForm({
          isActive:        data.isActive ?? false,
          leftBgColor:     data.leftBgColor     || "#00bcd4",
          leftBgGradient:  data.leftBgGradient  || "#0097a7",
          rightBgColor:    data.rightBgColor    || "#f4f4f4",
          accentColor:     data.accentColor     || "#00bcd4",
          headingColor:    data.headingColor    || "#111827",
          textColor:       data.textColor       || "#555555",
          buttonBgColor:   data.buttonBgColor   || "#111827",
          buttonTextColor: data.buttonTextColor || "#ffffff",
          preHeadline: data.preHeadline || "",
          heading:     data.heading     || "",
          description: data.description || "",
          buttonText:  data.buttonText  || "",
          buttonLink:  data.buttonLink  || "",
          cards: data.cards || defaultCards,
        });
      })
      .catch(() => toast.error("Failed to load"))
      .finally(() => setFetching(false));
  }, []);

  const set = (key: string, val: any) => setForm(p => ({ ...p, [key]: val }));

  const updateCard = (i: number, field: string, val: string) => {
    const cards = [...form.cards];
    cards[i] = { ...cards[i], [field]: val };
    set("cards", cards);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put("/api/settings/features", form);
      toast.success("Features section saved!");
    } catch {
      toast.error("Failed to save");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return (
    <div className="flex items-center justify-center h-40">
      <div className="w-6 h-6 border-2 border-zinc-300 border-t-zinc-800 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      {/* Header */}
      <div className="border-b border-gray-200 pb-6 flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-light text-gray-900 tracking-tight">Features Section</h1>
          <p className="text-sm text-gray-400 mt-1 font-light">Split section below hero — icon grid + text</p>
        </div>
        <div className="flex items-center gap-3 pt-1">
          <span className="text-xs font-medium uppercase tracking-widest text-gray-500">
            {form.isActive ? "Active" : "Hidden"}
          </span>
          <button type="button" onClick={() => set("isActive", !form.isActive)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${form.isActive ? "bg-black" : "bg-gray-200"}`}>
            <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform duration-200 ${form.isActive ? "translate-x-6" : "translate-x-1"}`} />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-10">

        {/* Text Content */}
        <Section title="📝 Right Side Text">
          <div className="space-y-5">
            <Field label="Pre-Headline (Cursive)">
              <input type="text" value={form.preHeadline} onChange={e => set("preHeadline", e.target.value)}
                className={input} placeholder="e.g. Provide Quality" />
            </Field>
            <Field label="Main Heading">
              <input type="text" value={form.heading} onChange={e => set("heading", e.target.value)}
                className={input} placeholder="e.g. Print Services" />
            </Field>
            <Field label="Description">
              <textarea value={form.description} onChange={e => set("description", e.target.value)}
                rows={4} className={input + " resize-none"} />
            </Field>
            <div className="grid grid-cols-2 gap-6">
              <Field label="Button Text">
                <input type="text" value={form.buttonText} onChange={e => set("buttonText", e.target.value)}
                  className={input} placeholder="e.g. More Info" />
              </Field>
              <Field label="Button Link">
                <input type="text" value={form.buttonLink} onChange={e => set("buttonLink", e.target.value)}
                  className={input} placeholder="e.g. /products" />
              </Field>
            </div>
          </div>
        </Section>

        {/* Service Cards */}
        <Section title="⊞ Service Cards (Left Grid)">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {form.cards.slice(0, 4).map((card, i) => (
              <div key={i} className="border border-gray-100 rounded-lg p-4 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Card {i + 1}</p>
                <Field label="Icon">
                  <select value={card.icon} onChange={e => updateCard(i, "icon", e.target.value)}
                    className={input}>
                    {ICON_OPTIONS.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                </Field>
                <Field label="Title">
                  <input type="text" value={card.title} onChange={e => updateCard(i, "title", e.target.value)}
                    className={input} placeholder="e.g. Offset Printing" />
                </Field>
              </div>
            ))}
          </div>
        </Section>

        {/* Colors */}
        <Section title="🎨 Colors">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { key: "leftBgColor",     label: "Left BG (Gradient Start)" },
              { key: "leftBgGradient",  label: "Left BG (Gradient End)" },
              { key: "rightBgColor",    label: "Right Panel BG" },
              { key: "accentColor",     label: "Accent / Pre-Headline Color" },
              { key: "headingColor",    label: "Heading Color" },
              { key: "textColor",       label: "Description Text Color" },
              { key: "buttonBgColor",   label: "Button Background" },
              { key: "buttonTextColor", label: "Button Text Color" },
            ].map(({ key, label }) => (
              <Field key={key} label={label}>
                <div className="flex items-center gap-3 pt-1">
                  <input type="color" value={(form as any)[key]}
                    onChange={e => set(key, e.target.value)}
                    className="w-9 h-9 rounded-lg border border-gray-200 cursor-pointer p-0.5 bg-white" />
                  <input type="text" value={(form as any)[key]}
                    onChange={e => set(key, e.target.value)}
                    className="flex-1 bg-transparent border-0 border-b border-gray-200 py-2 text-sm focus:ring-0 focus:border-black font-mono" />
                </div>
              </Field>
            ))}
          </div>
        </Section>

        <div className="pt-4 border-t border-gray-100">
          <button type="submit" disabled={loading}
            className="px-8 py-3 bg-black cursor-pointer text-white text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors uppercase tracking-widest">
            {loading ? "Saving..." : "Save Features Section"}
          </button>
        </div>
      </form>
    </div>
  );
}

const input = "w-full bg-transparent border-0 border-b border-gray-200 py-3 text-sm focus:ring-0 focus:border-black transition-colors px-0 font-light";

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-4">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-gray-400">{title}</h2>
      {children}
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-900 uppercase tracking-widest mb-1">{label}</label>
      {children}
    </div>
  );
}
