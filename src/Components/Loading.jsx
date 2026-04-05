import React from "react";
import { motion } from "framer-motion";

const Loading = () => {
  const dotVariants = {
    animate: {
      y: [0, -12, 0],
      transition: {
        duration: 0.6,
        ease: "easeInOut",
        repeat: Infinity,
      },
    },
  };

  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        ease: "linear",
        repeat: Infinity,
      },
    },
  };

  return (
    <div className="w-full h-screen flex flex-col justify-center items-center bg-white dark:bg-gray-900 relative overflow-hidden px-4">
      {/* Background Glow */}
      <div className="absolute w-60 sm:w-72 md:w-80 h-60 sm:h-72 md:h-80 bg-cyan-400/20 dark:bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />

      {/* Spinner */}
      <motion.div
        className="relative w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 border-4 border-cyan-400 border-t-transparent rounded-full mb-6 sm:mb-8 md:mb-10 shadow-[0_0_20px_rgba(34,211,238,0.4)] dark:shadow-[0_0_25px_rgba(34,211,238,0.5)]"
        variants={spinnerVariants}
        animate="animate"
      >
        <div className="absolute inset-0 rounded-full blur-sm bg-cyan-400/30 dark:bg-cyan-500/20" />
      </motion.div>

      {/* Bouncing Dots */}
      <div className="flex gap-2 sm:gap-3 md:gap-4">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 bg-cyan-400 rounded-full shadow-[0_0_12px_rgba(34,211,238,0.7)] dark:shadow-[0_0_14px_rgba(34,211,238,0.8)]"
            variants={dotVariants}
            animate="animate"
            transition={{ delay: i * 0.2 }}
          />
        ))}
      </div>

      {/* Loading Text */}
      <motion.p
        className="mt-4 sm:mt-6 md:mt-8 text-cyan-700 dark:text-cyan-300 text-base sm:text-lg md:text-xl font-semibold tracking-wide flex items-center gap-1"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
      >
        Loading<span className="animate-pulse">...</span>
      </motion.p>
    </div>
  );
};

export default Loading;