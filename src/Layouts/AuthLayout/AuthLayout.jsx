import React from "react";
import Navbar from "../../Components/Navbar/Navbar";
import { Outlet } from "react-router";
import Footer from "../../Components/Footer/Footer";

const AuthLayout = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
    
      <Navbar />

   
      <main className="grow container mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-20">
       
        <Outlet />
      </main>

     
      <Footer />
    </div>
  );
};

export default AuthLayout;
