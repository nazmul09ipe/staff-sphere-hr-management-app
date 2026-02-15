// src/Routes/Router.jsx
import { createBrowserRouter } from "react-router";

// Layouts
import HomeLayout from "../Layouts/HomeLayout/HomeLayout";
import AuthLayout from "../Layouts/AuthLayout/AuthLayout";

// Pages
import Home from "../Pages/Home/Home";
import Contact from "../Pages/Contact";
import Terms from "../Pages/Terms";
import Login from "../Pages/Login";
import Register from "../Pages/Register";

import ForgetPassword from "../Pages/ForgetPassword";
import PrivateRoute from "../Components/PrivateRoute";
import DashboardLayout from "../Layouts/DashboardLayout/DashboardLayout";
import DashboardHome from "../Pages/Dashboard/DashboardHome";
import EmployeeWorkSheet from "../Pages/Dashboard/EmployeeWorkSheet";
import EmployeePaymentHistory from "../Pages/Dashboard/EmployeePaymentHistory";
import HrEmployeeList from "../Pages/Dashboard/HrEmployeeList";
import EmployeeDetails from "../Pages/Dashboard/EmployeeDetails";
import HrWorkRecords from "../Pages/Dashboard/HrWorkRecords";
import AdminAllEmployeeList from "../Pages/Dashboard/AdminAllEmployeeList";
import AdminPaymentApproval from "../Pages/Dashboard/AdminPaymentApproval";

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
      { path: "forgetPassword", element: <ForgetPassword /> },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      { index: true, element: <DashboardHome /> },
      { path: "employee-work-sheet", element: <EmployeeWorkSheet /> },
      { path: "employee-payment-history", element: <EmployeePaymentHistory /> },
      { path: "hr-employee-list", element: <HrEmployeeList /> },
      {path: "employee-details/:email",element: <EmployeeDetails />, },
      {path: "hr-work-records",element: <HrWorkRecords />, },
      {path: "admin-all-employee-list",element: <AdminAllEmployeeList />, },
      {path: "admin-payment-approval",element: <AdminPaymentApproval />, },
        
        
        
     
    ],
  },
]);

export default router;
