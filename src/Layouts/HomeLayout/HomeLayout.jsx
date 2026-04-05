import React from "react";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import { Outlet, ScrollRestoration, useNavigation, useLocation } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import Loading from "../../Components/Loading";

const HomeLayout = () => {
  const { state } = useNavigation();
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-500">
      
      <ScrollRestoration />

      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <main
        className={`grow transition-all duration-500 ${
          isHome
            ? "px-2 sm:px-4 md:px-6 lg:px-0 py-0 bg-transparent"
            : "w-full max-w-[1280px] mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-8 md:py-10"
        }`}
      >
        <AnimatePresence mode="wait">
          {state === "loading" ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full flex justify-center items-center min-h-[50vh] sm:min-h-[60vh]"
            >
              <Loading />
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className={`transition-all duration-500 w-full
                ${isHome ? "" : "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 border border-gray-200/60 dark:border-gray-700/60"}
              `}
            >
              <Outlet />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default HomeLayout;