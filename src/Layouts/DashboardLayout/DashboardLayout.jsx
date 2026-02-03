// src/Pages/Dashboard.jsx
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../../Contexts/AuthContext/AuthProvider";
import EmployeeDashboard from "../../Pages/Dashboard/EmployeeDashboard";
import HrDashboard from "../../Pages/Dashboard/HrDashboard";
import AdminDashboard from "../..//Pages/Dashboard/AdminDashboard";

const Dashboard = () => {
  const { role, loading } = useContext(AuthContext);
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();

  // Wait until loading is false and role is available
  useEffect(() => {
    if (!loading) {
      setReady(true);

      // Optional: redirect /dashboard to role-specific route
      if (role === "employee") navigate("/dashboard/work-sheet", { replace: true });
      else if (role === "hr") navigate("/dashboard/employee-list", { replace: true });
      else if (role === "admin") navigate("/dashboard/all-employee-list", { replace: true });
    }
  }, [loading, role, navigate]);

  if (loading || !ready) {
    return <div className="text-center mt-10 text-gray-700 dark:text-gray-300">Loading Dashboard...</div>;
  }

  // Fallback if somehow role is missing
  if (!role) return <div className="text-center mt-10 text-red-500">Role not assigned.</div>;

  // You can remove this return if navigation works above
  if (role === "employee") return <EmployeeDashboard />;
  if (role === "hr") return <HrDashboard />;
  if (role === "admin") return <AdminDashboard />;

  return <div className="text-center mt-10">Role not recognized.</div>;
};

export default Dashboard;