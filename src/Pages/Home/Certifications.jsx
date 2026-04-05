import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";

const certifications = [
  {
    name: "ISO 9001",
    image: "https://i.ibb.co/6cW4mxn2/Screenshot-2025-12-02-235308.png",
  },
  {
    name: "Oeko-Tex Standard 100",
    image: "https://i.ibb.co/s9x9zRjy/Screenshot-2025-12-02-235058.png",
  },
  {
    name: "SA8000",
    image: "https://i.ibb.co/QvVChwnz/Screenshot-2025-12-02-235124.png",
  },
  {
    name: "WRAP",
    image: "https://i.ibb.co/D0MHR00/Screenshot-2025-12-02-235152.png",
  },
];

const Certifications = () => {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-5">
        {/* SECTION HEADER */}
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white text-center mb-12">
          Our Certifications & Achievements
        </h2>

        {/* SWIPER CAROUSEL */}
        <Swiper
          effect={"coverflow"}
          grabCursor={true}
          centeredSlides={true}
          slidesPerView={"auto"}
          coverflowEffect={{
            rotate: 0,
            stretch: 0,
            depth: 120,
            modifier: 2,
            slideShadows: false,
          }}
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          modules={[EffectCoverflow, Autoplay, Pagination]}
          className="w-full max-w-5xl mx-auto"
        >
          {certifications.map((cert, index) => (
            <SwiperSlide
              key={index}
              className="w-56 sm:w-64 md:w-72 lg:w-80 flex justify-center"
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 flex flex-col items-center text-center transition-transform duration-300 hover:scale-105">
                <img
                  src={cert.image}
                  alt={cert.name}
                  className="w-32 h-32 sm:w-40 sm:h-40 object-contain mb-4"
                />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white">
                  {cert.name}
                </h3>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
};

export default Certifications;