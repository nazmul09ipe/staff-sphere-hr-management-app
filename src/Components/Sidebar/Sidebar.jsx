// src/components/Sidebar.jsx
import React from "react";
import { Link } from "react-router";

const Sidebar = ({ user }) => {
  // user.role = "employee" | "hr" | "admin"
  return (
    <div className="w-64 min-h-screen bg-gray-100 p-4 shadow-md">
      <h2 className="text-xl font-bold mb-6">Dashboard</h2>

      <ul className="space-y-2">
        {/* Employee Links */}
        {user.role === "employee" && (
          <>
            <li>
              <Link
                to="/dashboard/work-sheet"
                className="block p-2 rounded hover:bg-gray-200"
              >
                Work Sheet
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/payment-history"
                className="block p-2 rounded hover:bg-gray-200"
              >
                Payment History
              </Link>
            </li>
          </>
        )}

        {/* HR Links */}
        {user.role === "hr" && (
          <>
            <li>
              <Link
                to="/dashboard/employee-list"
                className="block p-2 rounded hover:bg-gray-200"
              >
                Employee List
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/progress"
                className="block p-2 rounded hover:bg-gray-200"
              >
                Work Progress
              </Link>
            </li>
          </>
        )}

        {/* Admin Links */}
        {user.role === "admin" && (
          <>
            <li>
              <Link
                to="/dashboard/all-employee-list"
                className="block p-2 rounded hover:bg-gray-200"
              >
                All Employees
              </Link>
            </li>
            <li>
              <Link
                to="/dashboard/payroll"
                className="block p-2 rounded hover:bg-gray-200"
              >
                Payroll Requests
              </Link>
            </li>
          </>
        )}
      </ul>
    </div>
  );
};

export default Sidebar;
