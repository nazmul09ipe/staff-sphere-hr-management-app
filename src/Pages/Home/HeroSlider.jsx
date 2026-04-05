import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import bg1 from "../../assets/banner-1.jpg";
import bg2 from "../../assets/banner-2.jpg";

const slides = [bg1, bg2];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);

  // Automatically cycle through slides
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 10000); // 10 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full min-h-[80vh] sm:min-h-screen overflow-hidden z-0">
      
      {/* Animated Slide */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slides[current]}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 bg-cover bg-center w-full h-full"
          style={{
            backgroundImage: `url(${slides[current]})`,
          }}
        />
      </AnimatePresence>

      {/* Optional overlay for better text visibility */}
      <div className="absolute inset-0 bg-black/25"></div>

      {/* Pagination Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-10">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`w-3 h-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-white ${
              current === index ? "bg-white scale-125" : "bg-gray-400/70"
            }`}
          />
        ))}
      </div>

      {/* Optional Hero Text Overlay */}
      <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4 sm:px-10">
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white drop-shadow-lg">
          Welcome to Our Company
        </h1>
        <p className="mt-4 text-sm sm:text-lg md:text-xl text-white/90 max-w-2xl drop-shadow-md">
          Delivering excellence and quality in every project we undertake.
        </p>
      </div>
    </section>
  );
};

export default HeroSlider;