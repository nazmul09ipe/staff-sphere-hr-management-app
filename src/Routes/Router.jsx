import { createBrowserRouter } from "react-router";
import HomeLayout from "../Layouts/HomeLayout/HomeLayout";
import AuthLayout from "../Layouts/AuthLayout/AuthLayout";
import Dashboard from "../Layouts/DashboardLayout/Dashboard";
import PrivateRoute from "../Components/PrivateRoute";

import Home from "../Pages/Home/Home";
import Contact from "../Pages/Contact";
import Terms from "../Pages/Terms";
import Login from "../Pages/Login";
import Register from "../Pages/Register";
import ForgetPassword from "../Pages/ForgetPassword";
import Error from "../Pages/Error";
import Unauthorized from "../Pages/Unauthorized";

// Dashboard pages
import EmployeeWorkSheet from "../Pages/Dashboard/EmployeeWorkSheet";
import EmployeePaymentHistory from "../Pages/Dashboard/EmployeePaymentHistory";
import HR_EmployeeList from "../Pages/Dashboard/HR_Employee_List";
import HR_Progress from "../Pages/Dashboard/HR_Progress";
import HR_Details from "../Pages/Dashboard/HR_Details";
import Admin_AllEmployees from "../Pages/Dashboard/Admin_AllEmployees";
import Admin_Payroll from "../Pages/Dashboard/Admin_Payroll";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: "contact", element: <Contact /> },
      { path: "terms", element: <Terms /> },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "forget-password", element: <ForgetPassword /> },
    ],
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    children: [
      { element: <PrivateRoute allowedRoles={["employee"]} />, children: [
        { path: "work-sheet", element: <EmployeeWorkSheet /> },
        { path: "payment-history", element: <EmployeePaymentHistory /> },
      ]},
      { element: <PrivateRoute allowedRoles={["hr"]} />, children: [
        { path: "employee-list", element: <HR_EmployeeList /> },
        { path: "progress", element: <HR_Progress /> },
        { path: "details/:slug", element: <HR_Details /> },
      ]},
      { element: <PrivateRoute allowedRoles={["admin"]} />, children: [
        { path: "all-employee-list", element: <Admin_AllEmployees /> },
        { path: "payroll", element: <Admin_Payroll /> },
      ]},
      { path: "", element: <Unauthorized /> }, // default
    ],
  },
  { path: "*", element: <Error /> },
]);

export default router;
