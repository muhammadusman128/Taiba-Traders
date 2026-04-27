"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import LocalImageUpload from "@/components/LocalImageUpload";

export default function SiteSettingsPage() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    logo: "",
    favicon: "",
    siteName: "",
    siteTagline: "",
    siteDescription: "",
    aboutUsText: "",
    contactUsText: "",
    contactEmail: "",
    contactPhone: "",
    contactAddress: "",
    contactMapLink: "",
    paymentAccountDetails: "",
    deliveryChargesEnabled: false,
    deliveryChargeAmount: 0,
  });

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const { data } = await axios.get("/api/settings/site");
        setFormData({
          logo: data.logo || "/logomain.png",
          favicon: data.favicon || "/logo.png",
          siteName: data.siteName || "",
          siteTagline: data.siteTagline || "",
          siteDescription: data.siteDescription || "",
          aboutUsText: data.aboutUsText || "",
          contactUsText: data.contactUsText || "",
          contactEmail: data.contactEmail || "",
          contactPhone: data.contactPhone || "",
          contactAddress: data.contactAddress || "",
          contactMapLink: data.contactMapLink || "",
          paymentAccountDetails:
            data.paymentAccountDetails ||
            "JazzCash: 0308 6753520 (Rabia Malik)",
          deliveryChargesEnabled: data.deliveryChargesEnabled || false,
          deliveryChargeAmount: data.deliveryChargeAmount || 0,
        });
      } catch (error) {
        toast.error("Failed to load site settings");
      } finally {
        setFetching(false);
      }
    };
    fetchSettings();
  }, []);

  const handleImageUpload = (url: string) => {
    setFormData((prev) => ({
      ...prev,
      logo: url,
    }));
  };

  const handleImageRemove = () => {
    setFormData((prev) => ({
      ...prev,
      logo: "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.put("/api/settings/site", formData);
      toast.success("Site settings updated successfully");
    } catch (error) {
      toast.error("Failed to update site settings");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="text-sm text-gray-500 font-light">
        Loading settings...
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-12">
      <div className="border-b border-gray-200 pb-6">
        <h1 className="text-3xl font-light text-gray-900 tracking-tight">
          Site Settings
        </h1>
        <p className="text-sm text-gray-400 mt-2 font-light">
          Manage your global site configuration
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div>
          <h2 className="text-sm uppercase tracking-widest text-gray-400 font-semibold mb-6">
            Brand Identity
          </h2>

          <div className="border-b border-gray-100 pb-8">
            <label className="block text-xs font-medium text-gray-900 uppercase tracking-widest mb-4">
              Site Logo
            </label>
            <div className="max-w-xs">
              <LocalImageUpload
                value={formData.logo}
                onChange={handleImageUpload}
                onRemove={handleImageRemove}
              />
            </div>
            <p className="text-xs text-gray-400 font-light mt-4">
              Recommended size: 140x38 or similar ratio. Used in navbar and
              footer.
            </p>
          </div>
          <div className="border-b border-gray-100 pb-8 mt-8">
            <label className="block text-xs font-medium text-gray-900 uppercase tracking-widest mb-4">
              Site Favicon
            </label>
            <LocalImageUpload
              value={formData.favicon}
              onChange={(url) => setFormData((prev) => ({ ...prev, favicon: url }))}
              onRemove={() => setFormData((prev) => ({ ...prev, favicon: "" }))}
              className="w-16 h-16 rounded-xl"
            />
            <p className="text-xs text-gray-400 font-light mt-4">
              Recommended size: 32x32. Used in browser tabs.
            </p>
          </div>
        </div>

        <div>
          <h2 className="text-sm uppercase tracking-widest text-gray-400 font-semibold mb-6">
            SEO & Metadata
          </h2>

          <div className="border-b border-gray-100 pb-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-medium text-gray-900 uppercase tracking-widest mb-2">
                  Site Name
                </label>
                <input
                  type="text"
                  value={formData.siteName}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      siteName: e.target.value,
                    }))
                  }
                  className="w-full bg-transparent border-0 border-b border-gray-200 py-3 text-sm focus:ring-0 focus:border-black transition-colors px-0 font-light"
                  placeholder="e.g. Taiba Traders"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-900 uppercase tracking-widest mb-2">
                  Site Tagline
                </label>
                <input
                  type="text"
                  value={formData.siteTagline}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      siteTagline: e.target.value,
                    }))
                  }
                  className="w-full bg-transparent border-0 border-b border-gray-200 py-3 text-sm focus:ring-0 focus:border-black transition-colors px-0 font-light"
                  placeholder="e.g. Pakistan's Trusted Clothing Brand"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-900 uppercase tracking-widest mb-2">
                Site Description (SEO)
              </label>
              <textarea
                value={formData.siteDescription}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    siteDescription: e.target.value,
                  }))
                }
                className="w-full bg-transparent border-0 border-b border-gray-200 py-3 text-sm focus:ring-0 focus:border-black transition-colors px-0 font-light min-h-[80px] resize-y"
                placeholder="A short description of your website for search engines..."
              />
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-sm uppercase tracking-widest text-gray-400 font-semibold mb-6">
            Page Content
          </h2>

          <div className="border-b border-gray-100 pb-8 space-y-6">
            <div>
              <label className="block text-xs font-medium text-gray-900 uppercase tracking-widest mb-2">
                About Us Text
              </label>
              <textarea
                value={formData.aboutUsText}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    aboutUsText: e.target.value,
                  }))
                }
                className="w-full bg-transparent border-0 border-b border-gray-200 py-3 text-sm focus:ring-0 focus:border-black transition-colors px-0 font-light min-h-[120px] resize-y"
                placeholder="Tell your brand's story..."
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-900 uppercase tracking-widest mb-2">
                Contact Us Message (Optional)
              </label>
              <textarea
                value={formData.contactUsText}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    contactUsText: e.target.value,
                  }))
                }
                className="w-full bg-transparent border-0 border-b border-gray-200 py-3 text-sm focus:ring-0 focus:border-black transition-colors px-0 font-light min-h-[100px] resize-y"
                placeholder="A short message displayed above contact details..."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-medium text-gray-900 uppercase tracking-widest mb-2">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      contactEmail: e.target.value,
                    }))
                  }
                  className="w-full bg-transparent border-0 border-b border-gray-200 py-3 text-sm focus:ring-0 focus:border-black transition-colors px-0 font-light"
                  placeholder="e.g. info@yoursite.com"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-900 uppercase tracking-widest mb-2">
                  Contact Phone
                </label>
                <input
                  type="text"
                  value={formData.contactPhone}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      contactPhone: e.target.value,
                    }))
                  }
                  className="w-full bg-transparent border-0 border-b border-gray-200 py-3 text-sm focus:ring-0 focus:border-black transition-colors px-0 font-light"
                  placeholder="e.g. +1 234 567 890"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-900 uppercase tracking-widest mb-2">
                Physical Address
              </label>
              <input
                type="text"
                value={formData.contactAddress}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    contactAddress: e.target.value,
                  }))
                }
                className="w-full bg-transparent border-0 border-b border-gray-200 py-3 text-sm focus:ring-0 focus:border-black transition-colors px-0 font-light"
                placeholder="123 Example St, City, Country"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-900 uppercase tracking-widest mb-2">
                Google Map Embed Link (Optional)
              </label>
              <input
                type="text"
                value={formData.contactMapLink}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    contactMapLink: e.target.value,
                  }))
                }
                className="w-full bg-transparent border-0 border-b border-gray-200 py-3 text-sm focus:ring-0 focus:border-black transition-colors px-0 font-light"
                placeholder="Paste the src URL from Google Maps embed code"
              />
              <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-wide">
                Go to Google Maps → Share → Embed a map → Copy the "src" link inside the iframe tag.
              </p>
            </div>
            <div className="pt-4 border-t border-gray-100">
              <label className="block text-xs font-medium text-gray-900 uppercase tracking-widest mb-2">
                Prepaid Payment Details
              </label>
              <textarea
                value={formData.paymentAccountDetails}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    paymentAccountDetails: e.target.value,
                  }))
                }
                className="w-full bg-transparent border-0 border-b border-gray-200 py-3 text-sm focus:ring-0 focus:border-black transition-colors px-0 font-light resize-y min-h-[60px]"
                placeholder="e.g. Bank Transfer IBAN: XXXX, Account Title: YYY"
              />
              <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-wide">
                Details shown on checkout for prepaid orders.
              </p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-sm uppercase tracking-widest text-gray-400 font-semibold mb-6">
            Shipping & Delivery
          </h2>

          <div className="border-b border-gray-100 pb-8 space-y-6">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="deliveryChargesEnabled"
                checked={formData.deliveryChargesEnabled}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    deliveryChargesEnabled: e.target.checked,
                  }))
                }
                className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
              />
              <label
                htmlFor="deliveryChargesEnabled"
                className="text-xs font-medium text-gray-900 uppercase tracking-widest"
              >
                Enable Delivery Charges
              </label>
            </div>

            {formData.deliveryChargesEnabled && (
              <div>
                <label className="block text-xs font-medium text-gray-900 uppercase tracking-widest mb-2">
                  Delivery Charge Amount (Rs)
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.deliveryChargeAmount}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      deliveryChargeAmount: Number(e.target.value),
                    }))
                  }
                  className="w-full max-w-xs bg-transparent border-0 border-b border-gray-200 py-3 text-sm focus:ring-0 focus:border-black transition-colors px-0 font-light"
                  placeholder="e.g. 200"
                />
              </div>
            )}
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-black cursor-pointer text-white text-sm font-medium hover:bg-gray-800 disabled:opacity-50 transition-colors uppercase tracking-widest"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
