'use client'; // Swiper components are client-side

import React from 'react';
import Image from 'next/image'; // Import next/image
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/autoplay';
import 'swiper/css/effect-fade'; // Added for fade effect

// import required modules
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';

const Slider = () => {
  const slides = [
    {
      id: 1,
      imageUrl:
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80',
      alt: 'Abstract landscape with mountains and lake',
      title: 'Explore New Horizons',
      description:
        'Unlock a world of possibilities with our innovative platform.',
    },
    {
      id: 2,
      imageUrl:
        'https://images.unsplash.com/photo-1519681393784-d120267933ba?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80',
      alt: 'Snowy mountain peaks under a starry sky',
      title: 'Reach Your Peak',
      description: 'Empowering you to achieve your goals, faster and smarter.',
    },
    {
      id: 3,
      imageUrl:
        'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1200&q=80',
      alt: 'Wooden walkway through a misty forest lake',
      title: 'Journey With Confidence',
      description: 'Reliable, secure, and always there when you need us.',
    },
  ];

  return (
    // The parent div (from Layout.jsx) controls width, this should fill its height.
    <div className="h-full w-full relative text-white overflow-hidden">
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        loop={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        className="h-full w-full" // Ensure Swiper takes full height and width of its container
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id} className="h-full w-full">
            {/* Slide content wrapper */}
            <div className="h-full w-full relative">
              {/* Background Image */}
              <Image
                src={slide.imageUrl}
                alt={slide.alt}
                layout="fill" // Fill the parent container
                objectFit="cover" // Cover the slide area, equivalent to bg-cover
                priority={slide.id === 1} // Prioritize loading the first slide image
              />
              {/* Overlay for better text readability */}
              <div className="absolute inset-0 bg-black bg-opacity-50"></div>
              {/* Text Content - Centered */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6 md:p-12 z-10">
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                  {slide.title}
                </h3>
                <p className="text-base sm:text-lg lg:text-xl text-gray-200 max-w-xl">
                  {slide.description}
                </p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      {/* Custom Swiper Styles (can be moved to globals.css or a CSS module if preferred) */}
      <style jsx global>{`
        .swiper-button-next,
        .swiper-button-prev {
          color: rgba(255, 255, 255, 0.8); /* Semi-transparent white */
          transition: color 0.3s ease;
        }
        .swiper-button-next:hover,
        .swiper-button-prev:hover {
          color: #ffffff; /* Solid white on hover */
        }
        .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.5);
          width: 10px;
          height: 10px;
          opacity: 1; /* Tailwind might interfere, ensure opacity is 1 */
          transition:
            background-color 0.3s ease,
            transform 0.3s ease;
        }
        .swiper-pagination-bullet-active {
          background: #ffffff;
          transform: scale(1.2);
        }
      `}</style>
    </div>
  );
};

export default Slider;
