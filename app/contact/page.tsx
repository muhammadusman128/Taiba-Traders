import { Metadata } from "next";
import Setting from "@/models/Setting";
import connectDB from "@/lib/mongodb";
import { FiMail, FiPhone, FiMapPin } from "react-icons/fi";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with us.",
};

export const revalidate = 60;

async function getContactData() {
  try {
    await connectDB();
    const settings = await Setting.findOne({ key: "site" });
    return {
      text: settings?.value?.contactUsText || "",
      email: settings?.value?.contactEmail || "hello@ujavenue.com",
      phone: settings?.value?.contactPhone || "+1 (000) 000-0000",
      address:
        settings?.value?.contactAddress || "123 Main St, Fashion District",
      mapLink: settings?.value?.contactMapLink || "",
    };
  } catch (error) {
    return {
      text: "",
      email: "hello@ujavenue.com",
      phone: "+1 (000) 000-0000",
      address: "123 Main St, Fashion District",
      mapLink: "",
    };
  }
}

export default async function ContactPage() {
  const data = await getContactData();

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-6 pt-24 md:pt-32 pb-16">
        <div className="text-center mb-16 md:mb-24">
          <h1 className="text-3xl md:text-5xl font-light text-gray-900 uppercase tracking-widest mb-6">
            Contact
          </h1>
          <p className="text-xs md:text-sm uppercase tracking-widest text-gray-400 font-light">
            WE WOULD LOVE TO HEAR FROM YOU
          </p>
          {data.text && (
            <div className="mt-12 max-w-2xl mx-auto">
              <p className="text-sm md:text-base text-gray-600 font-light leading-relaxed whitespace-pre-wrap">
                {data.text}
              </p>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-y-12 gap-x-8 border-t border-b border-gray-100 py-16">
          <div className="flex flex-col items-center text-center group">
            <div className="w-12 h-12 mb-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-white group-hover:border-black transition-all duration-300">
              <FiMail className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-widest mb-3">
              Email
            </h3>
            <a
              href={`mailto:${data.email}`}
              className="text-sm font-light text-gray-500 hover:text-black transition-colors"
            >
              {data.email}
            </a>
          </div>

          <div className="flex flex-col items-center text-center group">
            <div className="w-12 h-12 mb-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-white group-hover:border-black transition-all duration-300">
              <FiPhone className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-widest mb-3">
              Phone
            </h3>
            <a
              href={`tel:${data.phone.replace(/[^0-9+]/g, "")}`}
              className="text-sm font-light text-gray-500 hover:text-black transition-colors"
            >
              {data.phone}
            </a>
          </div>

          <div className="flex flex-col items-center text-center group">
            <div className="w-12 h-12 mb-6 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:bg-black group-hover:text-white group-hover:border-black transition-all duration-300">
              <FiMapPin className="w-5 h-5" />
            </div>
            <h3 className="text-xs font-semibold text-gray-900 uppercase tracking-widest mb-3">
              Address
            </h3>
            <span className="text-sm font-light text-gray-500 px-4">
              {data.address}
            </span>
          </div>
        </div>

        {data.mapLink && (
          <div className="mt-24">
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 uppercase tracking-widest text-center">
              Our Location
            </h2>
          </div>
        )}
      </div>

      {data.mapLink && (
        <div className="w-full mt-10">
          <iframe
            src={(() => {
              let link = data.mapLink;
              if (link.includes("<iframe") && link.includes("src=")) {
                const match = link.match(/src="([^"]+)"/);
                if (match) return match[1];
              }
              return link;
            })()}
            width="100%"
            height="500"
            style={{ border: 0 }}
            allowFullScreen={true}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full grayscale-[0.5] opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-700"
          ></iframe>
        </div>
      )}
    </div>
  );
}
