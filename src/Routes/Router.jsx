import { Component } from "react";

import { createBrowserRouter } from "react-router";
import Login from './../Pages/Login';
import Register from './../Pages/Register';
import ForgetPassword from './../Pages/ForgetPassword';
import Error from "../Pages/Error";
import Terms from './../Pages/Terms';
import Contact from './../Pages/Contact';
import HomeLayout from '../Layouts/HomeLayout/HomeLayout';
import AuthLayout from '../Layouts/AuthLayout/AuthLayout';
import Home from './../Pages/Home/Home';




const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
    
        {
        path: "/terms",
        element: <Terms/>
      },
      {
        path: "/contact",
        element: <Contact/>
      },
   

    ]  },
    
    
    
      
    {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      {
        path: "/auth/login",
        element: <Login />,
      },
    
      {
        path: "/auth/register",
        element: <Register />,
      },
      {
        path: "/auth/forgetPassword",
        element: <ForgetPassword />,
      },
    ],
  },
  {
    path: "/*",
    element: <Error />,
  },
]);

export default router;
