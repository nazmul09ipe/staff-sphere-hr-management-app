import { motion } from "framer-motion";

const buyers = [
  "https://i.ibb.co/HLhYZPDf/Screenshot-2025-12-02-231507.png",
  "https://i.ibb.co/b5S8wZTP/Screenshot-2025-12-02-231538.png",
  "https://i.ibb.co/0RhB0W2k/Screenshot-2025-12-02-231601.png",
  "https://i.ibb.co/F4yMT4DQ/Screenshot-2025-12-02-231636.png",
  "https://i.ibb.co.com/cKDcVK6D/Screenshot-2025-12-02-232529.png",
  "https://i.ibb.co/8DtTNqkC/Screenshot-2025-12-02-231734.png",
  "https://i.ibb.co/TBThbM0T/Screenshot-2025-12-02-231811.png",
  "https://i.ibb.co/N6rM8DfR/Screenshot-2025-12-02-231846.png",
];

const OurBuyers = () => {
  return (
    <section className="py-16 bg-white dark:bg-gray-900 mb-20">
      <div className="max-w-7xl mx-auto px-5">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
          Our Reputed Buyers
        </h2>

        {/* Marquee / Slider */}
        <div className="overflow-hidden relative">
          <motion.div
            className="flex gap-10"
            animate={{ x: ["0%", "-100%"] }}
            transition={{
              repeat: Infinity,
              repeatType: "loop",
              duration: 30,
              ease: "linear",
            }}
          >
            {buyers.concat(buyers).map((buyer, index) => (
              <div
                key={index}
                className="flex-shrink-0 w-48 h-24 bg-white dark:bg-gray-800 rounded-lg shadow-md flex items-center justify-center p-4"
              >
                <img
                  src={buyer}
                  alt={`Buyer ${index + 1}`}
                  className="max-h-full object-contain"
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
