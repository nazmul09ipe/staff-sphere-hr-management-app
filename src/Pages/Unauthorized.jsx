// src/Pages/Unauthorized.jsx
import React from "react";
import { Link } from "react-router";

const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-6">
      <div className="bg-white shadow-md rounded-lg p-10 text-center">
        <h1 className="text-4xl font-bold text-red-500 mb-4">🚫 Unauthorized</h1>
        <p className="text-lg mb-6">
          You do not have permission to access this page.
        </p>
        <Link
          to="/"
          className="btn btn-primary bg-blue-500 hover:bg-blue-600 text-white"
        >
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default Unauthorized;
