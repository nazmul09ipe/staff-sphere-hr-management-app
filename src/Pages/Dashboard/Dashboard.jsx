// src/Pages/Dashboard.jsx
import React, { useContext } from "react";
import { Link, Outlet } from "react-router";
import { AuthContext } from "../../Contexts/AuthContext/AuthProvider";

const Dashboard = () => {
  const { role, loading } = useContext(AuthContext);

  if (loading) return <div className="text-center mt-10">Loading Dashboard...</div>;

  const links = {
    employee: [
      { name: "Employee Work Sheet", path: "/dashboard/work-sheet" },
      { name: "Payment History", path: "/dashboard/payment-history" },
    ],
    hr: [
      { name: "Employee List", path: "/dashboard/employee-list" },
      { name: "Progress", path: "/dashboard/progress" },
    ],
    admin: [
      { name: "All Employees", path: "/dashboard/all-employee-list" },
      { name: "Payroll", path: "/dashboard/payroll" },
    ],
  };

  return (
    <div className="drawer drawer-mobile">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

      {/* Drawer Content */}
      <div className="drawer-content flex flex-col p-6 bg-gray-50 dark:bg-gray-900 min-h-screen">
        {/* Mobile drawer toggle */}
        <label
          htmlFor="dashboard-drawer"
          className="btn btn-primary drawer-button lg:hidden mb-4"
        >
          Open Menu
        </label>

        {/* Nested routes */}
        <Outlet />
      </div>

      {/* Drawer Sidebar */}
      <div className="drawer-side">
        <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
        <ul className="menu p-4 w-64 bg-base-200 text-base-content">
          <li className="mb-4 font-bold text-lg">Dashboard</li>
          {links[role]?.map((link) => (
            <li key={link.path}>
              <Link to={link.path}>{link.name}</Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
