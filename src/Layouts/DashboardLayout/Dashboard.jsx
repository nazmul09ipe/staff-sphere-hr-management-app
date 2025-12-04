// src/pages/Dashboard.jsx
import React, { useContext } from "react";
import { Outlet } from "react-router";
import Sidebar from "../../Components/Sidebar/Sidebar";
import Navbar from "../../Components/Navbar/Navbar";
import { AuthContext } from "../../Contexts/AuthContext/AuthProvider";

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-6">
          {/* Render the child routes here */}
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
