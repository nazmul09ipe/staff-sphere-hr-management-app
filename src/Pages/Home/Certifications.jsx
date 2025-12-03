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
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
          Our Certifications & Achievements
        </h2>

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
            delay: 2000,
            disableOnInteraction: false,
          }}
          modules={[EffectCoverflow, Autoplay]}
          className="w-full max-w-md mx-auto"
        >
          {certifications.map((cert, index) => (
            <SwiperSlide
              key={index}
              className="w-64" // Important for coverflow spacing
            >
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 flex flex-col items-center text-center">
                <img
                  src={cert.image}
                  alt={cert.name}
                  className="w-40 h-40 object-contain mb-4"
                />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
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
