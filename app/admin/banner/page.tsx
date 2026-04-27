"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminBannerPage() {
  const [text, setText] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [bgColor, setBgColor] = useState("#000000");
  const [textColor, setTextColor] = useState("#ffffff");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    axios
      .get("/api/banner")
      .then((res) => {
        if (res.data?.text) setText(res.data.text);
        if (res.data?.isActive !== undefined) setIsActive(res.data.isActive);
        if (res.data?.bgColor) setBgColor(res.data.bgColor);
        if (res.data?.textColor) setTextColor(res.data.textColor);
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const save = async () => {
    setIsSaving(true);
    try {
      await axios.put("/api/banner", { text, isActive, bgColor, textColor });
    } catch (err: any) {
      console.error(err)
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Top Banner</h1>
      <p className="text-sm text-gray-600 mb-4">
        Edit the small announcement text shown at the top of the site.
      </p>

      <div className="space-y-3 max-w-xl">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full border border-gray-200 rounded p-3 min-h-20"
        />

        <div className="flex gap-6 py-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Background Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-10 h-10 rounded cursor-pointer border-0 p-0"
              />
              <span className="text-sm text-gray-500 uppercase">{bgColor}</span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Text Color
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-10 h-10 rounded cursor-pointer border-0 p-0"
              />
              <span className="text-sm text-gray-500 uppercase">{textColor}</span>
            </div>
          </div>
        </div>

        <label className="flex items-center gap-3 cursor-pointer py-2">
          <input
            type="checkbox"
            checked={isActive}
            onChange={(e) => setIsActive(e.target.checked)}
            className="w-5 h-5 cursor-pointer accent-black"
          />
          <span className="text-sm font-medium text-gray-900">Show Top Banner</span>
        </label>

        <div className="flex items-center gap-3 pt-4">
          <button
            onClick={save}
            disabled={isSaving}
            className="px-4 py-2 bg-black cursor-pointer text-white rounded"
          >
            {isSaving ? "Saving..." : "Save"}
          </button>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 border rounded cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
