// src/Pages/Dashboard/EmployeeDashboard.jsx
import React from "react";
import { Outlet } from "react-router";

const EmployeeDashboard = ({ toggleSidebar }) => {
  return (
    <div>
      <button
        onClick={toggleSidebar}
        className="md:hidden px-3 py-2 bg-blue-600 text-white rounded mb-4"
      >
        Open Menu
      </button>
      <Outlet /> {/* Nested routes: work-sheet, payment-history */}
    </div>
  );
};

export default EmployeeDashboard;
