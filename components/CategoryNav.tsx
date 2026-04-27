'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';

interface Category {
  _id: string;
  name: string;
}

export default function CategoryNav() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get('/api/categories');
      const data = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data?.categories)
          ? res.data.categories
          : [];
      setCategories(data.slice(0, 6));
    } catch (error) {
      console.error('Error fetching categories:', error);
      setCategories([]);
    }
  };

  if (categories.length === 0) {
    return null;
  }

  return (
    <section className="bg-white py-8 md:py-10 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-sm md:text-base font-semibold text-black mb-6 md:mb-8 uppercase tracking-widest text-center">
          Shop by Category
        </h2>
        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={12}
          slidesPerView="auto"
          loop={false}
          className="pb-6"
        >
          {categories.map((category) => (
            <SwiperSlide key={category._id} style={{ width: '140px' }}>
              <Link href={`/products?category=${category._id}`} className="group cursor-pointer">
                <div className="flex flex-col items-center space-y-2">
                  {/* Category Box */}
                  <div className="w-24 h-24 bg-gray-100 border border-gray-200 group-hover:border-black group-hover:shadow-md transition-all duration-300 overflow-hidden rounded-lg flex items-center justify-center">
                    <div className="text-sm md:text-sm text-gray-600 uppercase tracking-wider font-medium text-center">
                      {category.name?.slice(0, 2) || 'NA'}
                    </div>
                  </div>

                  {/* Category Name */}
                  <span className="text-xs md:text-sm font-medium text-gray-600 group-hover:text-black transition-colors text-center uppercase tracking-widest leading-tight">
                    {category.name}
                  </span>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
