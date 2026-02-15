import React from "react";
import { Outlet, NavLink, Link } from "react-router";
import {
  FaHome,
  FaFileAlt,
  FaMoneyCheckAlt,
  FaArrowLeft,
  FaBars,
  FaClipboardList,
  FaUsersCog,
} from "react-icons/fa";
import logoImg from "../../assets/logo.png";

const DashboardLayout = () => {
  const navItem = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium
     ${isActive ? "bg-primary text-white" : "hover:bg-blue-800"}`;

  return (
    <div className="drawer lg:drawer-open min-h-screen bg-base-100">
      {/* Drawer toggle */}
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

      {/* MAIN CONTENT */}
      <div className="drawer-content flex flex-col">
        {/* Mobile top bar */}
        <div className="navbar bg-base-200 lg:hidden">
          <div className="flex-none">
            <label htmlFor="dashboard-drawer" className="btn btn-ghost text-xl">
              <FaBars />
            </label>
          </div>
          <div className="flex-1 text-lg font-semibold">Dashboard</div>
        </div>

        {/* Page outlet */}
        <div className="p-6">
          <Outlet />
        </div>
      </div>

      {/* SIDEBAR */}
      <div className="drawer-side">
        <label htmlFor="dashboard-drawer" className="drawer-overlay" />

        <aside className="w-72 min-h-full bg-linear-to-b from-slate-900 to-slate-800 text-gray-200 p-6 flex flex-col">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 mb-10">
            <img src={logoImg} alt="logo" className="w-12 h-12 rounded-full" />
            <h2 className="text-xl font-bold">NC Group</h2>
          </Link>

          {/* Nav */}
          <nav className="flex-1 space-y-2">
            <NavLink to="/dashboard" end className={navItem}>
              <FaHome />
              Dashboard Home
            </NavLink>

            <NavLink to="/dashboard/employee-work-sheet" className={navItem}>
              <FaFileAlt />
              Employee Work Sheet
            </NavLink>

            <NavLink
              to="/dashboard/employee-payment-history"
              className={navItem}
            >
              <FaMoneyCheckAlt />
              Employee Payment History
            </NavLink>
            <NavLink to="/dashboard/hr-employee-list" className={navItem}>
              <FaMoneyCheckAlt />
              HR Employee List
            </NavLink>
            <NavLink to="/dashboard/hr-work-records" className={navItem}>
              <FaClipboardList />
              HR Work Records
            </NavLink>
            <NavLink
              to="/dashboard/admin-all-employee-list"
              className={navItem}
            >
              <FaUsersCog />
              All Employee List
            </NavLink>

            <NavLink to="/dashboard/admin-payment-approval" className={navItem}>
              <FaMoneyCheckAlt />
              Payment Approval
            </NavLink>
          </nav>

          <div className="divider" />

          {/* Back home */}
          <NavLink to="/" className={navItem}>
            <FaArrowLeft />
            Back to Home
          </NavLink>
        </aside>
      </div>
    </div>
  );
};

export default DashboardLayout;
