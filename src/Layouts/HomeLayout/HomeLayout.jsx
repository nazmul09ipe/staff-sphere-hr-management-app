import React from "react";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import { Outlet, ScrollRestoration, useNavigation, useLocation } from "react-router";

import { motion, AnimatePresence } from "framer-motion";


const HomeLayout = () => {
  const { state } = useNavigation();
  const location = useLocation();
  const isHome = location.pathname === "/"; 

  return (
    <div className="flex flex-col min-h-screen bg-linear-to-b from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-500">
    
      <ScrollRestoration />

      <Navbar />

      
      <main
        className={`grow transition-all duration-500 ${
          isHome
            ? "px-0 sm:px-0 lg:px-0 py-0 bg-transparent" 
            : "container mx-auto px-3 sm:px-6 lg:px-8 py-6 sm:py-10"
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
              className={`transition-all duration-500 ${
                isHome
                  ? "" 
                  : "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl shadow-lg p-4 sm:p-6 lg:p-8 border border-gray-200/60 dark:border-gray-700/60"
              }`}
            >
              <Outlet />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    

   
      <Footer />
    </div>
  );
};

export default HomeLayout;
