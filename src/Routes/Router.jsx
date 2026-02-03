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

  
 
]);

export default router;
