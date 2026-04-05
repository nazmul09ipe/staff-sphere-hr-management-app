import { motion } from "framer-motion";

const buyers = [
  "https://i.ibb.co/HLhYZPDf/Screenshot-2025-12-02-231507.png",
  "https://i.ibb.co/b5S8wZTP/Screenshot-2025-12-02-231538.png",
  "https://i.ibb.co/0RhB0W2k/Screenshot-2025-12-02-231601.png",
  "https://i.ibb.co/F4yMT4DQ/Screenshot-2025-12-02-231636.png",
  "https://i.ibb.co/cKDcVK6D/Screenshot-2025-12-02-232529.png",
  "https://i.ibb.co/8DtTNqkC/Screenshot-2025-12-02-231734.png",
  "https://i.ibb.co/TBThbM0T/Screenshot-2025-12-02-231811.png",
  "https://i.ibb.co/N6rM8DfR/Screenshot-2025-12-02-231846.png",
];

const OurBuyers = () => {
  return (
    <section id="our-buyers" className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-5 sm:px-10 lg:px-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white text-center mb-12">
          Our Reputed Buyers
        </h2>

        {/* Marquee / Slider */}
        <div className="overflow-hidden relative">
          <motion.div
            className="flex gap-6 sm:gap-10"
            animate={{ x: ["0%", "-50%"] }} // looped movement
            transition={{
              repeat: Infinity,
              repeatType: "loop",
              duration: 40,
              ease: "linear",
            }}
          >
            {buyers.concat(buyers).map((buyer, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-32 sm:w-40 md:w-48 h-20 sm:h-24 md:h-28 bg-white dark:bg-gray-800 rounded-lg shadow-md flex items-center justify-center p-2 sm:p-4"
              >
                <img
                  src={buyer}
                  alt={`Buyer ${index + 1}`}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default OurBuyers;