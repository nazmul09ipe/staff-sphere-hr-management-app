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
    <div className="w-full h-screen flex flex-col justify-center items-center bg-white dark:bg-gray-900 relative overflow-hidden">
     
      <div className="absolute w-[300px] h-[300px] bg-cyan-400/20 dark:bg-cyan-500/10 rounded-full blur-3xl animate-pulse" />

    
      <motion.div
        className="relative w-16 h-16 sm:w-20 sm:h-20 border-4 border-cyan-400 border-t-transparent rounded-full mb-8 shadow-[0_0_20px_rgba(34,211,238,0.4)] dark:shadow-[0_0_25px_rgba(34,211,238,0.5)]"
        variants={spinnerVariants}
        animate="animate"
      >
        <div className="absolute inset-0 rounded-full blur-sm bg-cyan-400/30 dark:bg-cyan-500/20" />
      </motion.div>

  
      <div className="flex gap-3">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-4 h-4 sm:w-5 sm:h-5 bg-cyan-400 rounded-full shadow-[0_0_12px_rgba(34,211,238,0.7)]"
            variants={dotVariants}
            animate="animate"
            transition={{ delay: i * 0.2 }}
          />
        ))}
      </div>

   
      <motion.p
        className="mt-6 text-cyan-700 dark:text-cyan-300 text-lg sm:text-xl font-semibold tracking-wide"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
      >
        Loading<span className="animate-pulse">...</span>
      </motion.p>
    </div>
  );
};

export default Loading;
