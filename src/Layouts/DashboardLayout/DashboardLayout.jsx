import React, { useContext } from "react";
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
import AuthContext from "../../Contexts/AuthContext/AuthContext";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const DashboardLayout = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const { data: dbUser = {}, isLoading } = useQuery({
    queryKey: ["dbUser", user?.email],
    enabled: !!user?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/users/${user.email}`);
      return res.data.user;
    },
  });

  if (isLoading) return null; // wait for role

  const role = dbUser?.role || "employee";

  const navItem = ({ isActive }) =>
    `flex items-center gap-3 px-4 py-3 rounded-lg transition font-medium
     ${isActive ? "bg-white/20 text-cyan-200" : "text-white hover:bg-white/10 hover:text-white"}`;

  return (
    <div className="drawer lg:drawer-open min-h-screen">
      <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

      {/* MAIN CONTENT */}
      <div className="drawer-content flex flex-col min-h-screen overflow-hidden">
        {/* Top navbar for small screens */}
        <div className="navbar bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400 lg:hidden">
          <label htmlFor="dashboard-drawer" className="btn btn-ghost text-xl text-white">
            <FaBars />
          </label>
          <span className="ml-3 font-semibold text-white text-lg">Dashboard</span>
        </div>

        {/* Page content */}
        <div className="p-4 sm:p-6 flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>

      {/* SIDEBAR */}
      <div className="drawer-side">
        <label htmlFor="dashboard-drawer" className="drawer-overlay" />

        <aside className="w-64 sm:w-72 md:w-80 min-h-full bg-gradient-to-b from-purple-600 via-blue-500 to-cyan-400 text-white p-4 sm:p-6 flex flex-col shadow-lg rounded-r-2xl overflow-y-auto">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 mb-8 sm:mb-10 flex-shrink-0">
            <img src={logoImg} alt="logo" className="w-10 h-10 sm:w-12 sm:h-12 rounded-full" />
            <h2 className="text-lg sm:text-xl font-bold text-white">NC Group</h2>
          </Link>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {/* COMMON */}
            <NavLink to="/dashboard" end className={navItem}>
              <FaHome /> Dashboard Home
            </NavLink>

            {/* EMPLOYEE */}
            {role === "employee" && (
              <>
                <NavLink to="/dashboard/employee-work-sheet" className={navItem}>
                  <FaFileAlt /> Work Sheet
                </NavLink>

                <NavLink to="/dashboard/employee-payment-history" className={navItem}>
                  <FaMoneyCheckAlt /> Payment History
                </NavLink>
              </>
            )}

            {/* HR */}
            {role === "hr" && (
              <>
                <NavLink to="/dashboard/hr-employee-list" className={navItem}>
                  <FaUsersCog /> Employee List
                </NavLink>

                <NavLink to="/dashboard/hr-work-records" className={navItem}>
                  <FaClipboardList /> Work Records
                </NavLink>
              </>
            )}

            {/* ADMIN */}
            {role === "admin" && (
              <>
                <NavLink to="/dashboard/admin-all-employee-list" className={navItem}>
                  <FaUsersCog /> All Employees
                </NavLink>

                <NavLink to="/dashboard/admin-payment-approval" className={navItem}>
                  <FaMoneyCheckAlt /> Payment Approval
                </NavLink>
              </>
            )}
          </nav>

          <div className="divider border-white/30 my-4" />

          {/* Back to Home */}
          <NavLink to="/" className={navItem}>
            <FaArrowLeft /> Back to Home
          </NavLink>

          {/* Mobile close button */}
          <label
            htmlFor="dashboard-drawer"
            className="btn btn-ghost absolute top-4 right-4 lg:hidden text-white"
          >
            <FaArrowLeft />
          </label>
        </aside>
      </div>
    </div>
  );
};

export default DashboardLayout;