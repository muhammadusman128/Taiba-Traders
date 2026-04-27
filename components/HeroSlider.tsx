"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
// @ts-ignore
import "swiper/css";
// @ts-ignore
import "swiper/css/pagination";
// @ts-ignore
import "swiper/css/navigation";
import Image from "next/image";
import Link from "next/link";
import axios from "axios";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: ["300", "400", "500", "700", "900"],
  subsets: ["latin"],
});

interface SliderItem {
  _id: string;
  title: string;
  image: string;
  buttonText: string;
  buttonLink: string;
  backgroundColor?: string;
}

interface HeroSliderProps {
  initialSliders?: SliderItem[];
  position?: string;
}

export default function HeroSlider({
  initialSliders = [],
  position = "top",
}: HeroSliderProps) {
  const [sliders, setSliders] = useState<SliderItem[]>(initialSliders);
  const [isLoading, setIsLoading] = useState(initialSliders.length === 0);

  useEffect(() => {
    // Always refresh once on mount to pick up latest sliders
    fetchSliders(initialSliders.length === 0);
  }, [initialSliders.length]);

  const fetchSliders = async (showLoader = true) => {
    try {
      if (showLoader) setIsLoading(true);
      const res = await axios.get("/api/sliders");
      // Handle both formats: array directly or object with sliders property
      let data = Array.isArray(res.data) ? res.data : res.data.sliders || [];
      // Filter out sliders without images and by position
      data = data.filter(
        (slider: any) =>
          slider.image &&
          slider.image.trim() !== "" &&
          (position === "top"
            ? !slider.position || slider.position === "top"
            : slider.position === position),
      );
      setSliders(data);
    } catch (error) {
      console.error("Error fetching sliders:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <section className="relative overflow-hidden w-full">
        <div className="w-full h-[25vh] sm:h-[50vh] md:h-[70vh] lg:h-[75vh] max-h-[700px] bg-gray-100 animate-pulse" />
      </section>
    );
  }

  if (sliders.length === 0) {
    return null;
  }

  return (
    <section className="relative w-full">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        navigation={false}
        loop={sliders.length > 1}
        key={sliders.map((s) => s._id).join("-")}
        className="w-full h-[25vh] sm:h-[50vh] md:h-[70vh] lg:h-[75vh] max-h-[700px]"
        slidesPerView={1}
        spaceBetween={0}
        centeredSlides={false}
      >
        {sliders.map((slider, index) => (
          <SwiperSlide
            key={slider._id}
            className="transition-colors duration-500 bg-transparent"
          >
            <div className="w-full h-full relative flex items-center justify-center">
              {slider.buttonLink && (
                <Link
                  href={slider.buttonLink}
                  className="absolute inset-0 z-10 cursor-pointer"
                  aria-label={slider.title || "Slide link"}
                />
              )}
              <Image
                src={slider.image}
                alt={slider.title || "Hero Image"}
                fill
                sizes="100vw"
                quality={95}
                className="object-cover object-center"
                loading={index === 0 ? "eager" : "lazy"}
                priority={index === 0}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Styles */}
      <style jsx global>{`
        .swiper-pagination-bullet {
          background: rgba(0, 0, 0, 0.2);
          opacity: 1;
          width: 10px;
          height: 10px;
          transition: all 0.3s ease;
        }

        .swiper-pagination-bullet-active {
          background: #000000;
          width: 32px;
          border-radius: 6px;
        }

        /* Move pagination to match content alignment */
        .swiper-pagination {
          width: auto !important;
          left: 50% !important;
          transform: translateX(-50%) !important;
          bottom: 1.5rem !important;
          text-align: center;
          z-index: 20;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeInUp {
          animation: fadeInUp 0.8s cubic-bezier(0.4, 0, 0.2, 1);
        }
      `}</style>
    </section>
  );
}
