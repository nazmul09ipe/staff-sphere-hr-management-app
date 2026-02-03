// src/Pages/Dashboard/HR_EmployeeDetails.jsx
import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router";
import axios from "axios";
import { AuthContext } from "../../Contexts/AuthContext/AuthProvider";
import { getAuth } from "firebase/auth";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const API_URL = "http://localhost:5000";

const HR_Details = () => {
  const { slug } = useParams(); // slug could be email or uid
  const { user } = useContext(AuthContext);
  const [backendToken, setBackendToken] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [workHistory, setWorkHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  // Get backend JWT
  useEffect(() => {
    const fetchBackendToken = async () => {
      if (!user) return;

      const auth = getAuth();
      const firebaseToken = await auth.currentUser.getIdToken();

      const res = await axios.post(`${API_URL}/jwt`, {
        uid: user.uid,
        email: user.email,
        role: "hr",
      });

      setBackendToken(res.data.token);
    };

    fetchBackendToken();
  }, [user]);

  // Fetch employee data and work records
  useEffect(() => {
    if (!backendToken) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // Get employee details
        const resEmp = await axios.get(`${API_URL}/users/${slug}`, {
          headers: { Authorization: `Bearer ${backendToken}` },
        });
        setEmployee(resEmp.data);

        // Get payroll history
        const resPayroll = await axios.get(`${API_URL}/payroll`, {
          headers: { Authorization: `Bearer ${backendToken}` },
        });

        // Filter payroll for this employee
        const employeePayrolls = resPayroll.data.filter(
          (p) => p.employeeId === resEmp.data._id
        );
        setWorkHistory(employeePayrolls);
      } catch (err) {
        console.error("Error fetching employee details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [backendToken, slug]);

  if (loading) return <p>Loading...</p>;
  if (!employee) return <p>Employee not found</p>;

  // Prepare data for Bar Chart
  const chartData = {
    labels: workHistory.map((p) => `${p.month}/${p.year}`),
    datasets: [
      {
        label: "Salary",
        data: workHistory.map((p) => p.amount),
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Employee Details</h2>

      <div className="flex items-center gap-4 mb-6">
        <img
          src={employee.photo || "https://via.placeholder.com/80"}
          alt={employee.name}
          className="w-20 h-20 rounded-full object-cover"
        />
        <div>
          <h3 className="text-lg font-semibold">{employee.name}</h3>
          <p>Designation: {employee.designation || "-"}</p>
          <p>Email: {employee.email}</p>
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-2">Salary History</h3>
      {workHistory.length > 0 ? (
        <Bar data={chartData} />
      ) : (
        <p>No salary records found.</p>
      )}
    </div>
  );
};

export default HR_Details;
