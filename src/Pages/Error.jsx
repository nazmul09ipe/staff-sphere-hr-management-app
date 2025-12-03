// src/pages/Error.jsx
import { motion } from "framer-motion";
import { Link } from "react-router";
import { FaHome } from "react-icons/fa";

const Error = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-linear-to-b from-emerald-100 via-emerald-200 to-emerald-400 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-6 text-center">
      
    
      <motion.h1
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-[8rem] sm:text-[12rem] md:text-[15rem] font-extrabold text-primary dark:text-emerald-400 leading-none drop-shadow-lg"
      >
        404
      </motion.h1>

     
      <motion.h2
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="text-3xl sm:text-5xl md:text-6xl font-semibold text-gray-800 dark:text-gray-100 mt-2"
      >
        Oops! Page Not Found
      </motion.h2>

      <motion.p
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="mt-5 text-gray-700 dark:text-gray-300 text-base sm:text-lg md:text-xl max-w-lg"
      >
        Sorry, the page you’re looking for doesn’t exist or may have been moved.
      </motion.p>

    
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-8"
      >
        <Link
          to="/"
          className="flex items-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-lg hover:bg-primary/90 transition duration-300"
        >
          <FaHome className="text-lg" /> Go Back Home
        </Link>
      </motion.div>
    </div>
  );
};

export default Error;
