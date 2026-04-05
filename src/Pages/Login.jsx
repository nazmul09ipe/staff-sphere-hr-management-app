// src/pages/auth/Login.jsx
// @flow strict
import * as React from "react";
import { useState, useContext } from "react";
import { useNavigate, Link, useLocation } from "react-router";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { useForm } from "react-hook-form";

import { auth } from "../../Firebase.config";

import PageTitle from "../Shared/PageTitle";
import AuthContext from "../Contexts/AuthContext/AuthContext";

function Login() {
  const { signInUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  // ✅ Email/Password Login
  const onSubmit = async (data) => {
    try {
      await signInUser(data.email, data.password);
      navigate(from);
    } catch (error) {
      alert(error.message);
    }
  };

  // ✅ Google Login
  const provider = new GoogleAuthProvider();
  const handleLoginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate(from);
    } catch (error) {
      console.log(error);
      alert("Google login failed");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800 p-4 sm:p-6 transition-colors duration-500">
      <PageTitle title="Login" />

      <div className="bg-white dark:bg-gray-900 shadow-2xl rounded-3xl w-full max-w-md p-6 sm:p-8 transition-colors duration-500">
        {/* Title */}
        <h1 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 dark:text-gray-100 mb-6 sm:mb-8">
          Login to Your Account
        </h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 sm:space-y-6"
        >
          {/* Email */}
          <div>
            <label className="block mb-1 sm:mb-2 font-medium text-gray-700 dark:text-gray-300 text-sm sm:text-base">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              {...register("email", { required: "Email is required" })}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-300"
            />
            {errors.email && (
              <p className="text-xs sm:text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block mb-1 sm:mb-2 font-medium text-gray-700 dark:text-gray-300 text-sm sm:text-base">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              {...register("password", { required: "Password is required" })}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 pr-12 focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors duration-300"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2/3 transform -translate-y-1/2 cursor-pointer text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-300"
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
            {errors.password && (
              <p className="text-xs sm:text-sm text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Forgot password */}
          <div className="text-right">
            <Link
              to="/auth/forgetPassword"
              className="text-xs sm:text-sm text-blue-600 dark:text-blue-400 hover:underline transition-colors duration-300"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-3 sm:py-3.5 rounded-xl text-white font-semibold 
            bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600
            hover:from-blue-600 hover:via-indigo-600 hover:to-purple-700
            shadow-lg hover:shadow-xl
            transition-all duration-300 ease-in-out
            transform hover:-translate-y-0.5 active:scale-95"
          >
            Login
          </button>

          {/* Google Login */}
          <button
            type="button"
            onClick={handleLoginWithGoogle}
            className="w-full py-3 sm:py-3.5 rounded-xl border border-gray-300 dark:border-gray-700 flex items-center justify-center gap-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300"
          >
            <FcGoogle size={22} />
            <span className="font-medium text-sm sm:text-base">
              Login with Google
            </span>
          </button>

          {/* Register Link */}
          <p className="text-center text-gray-700 dark:text-gray-300 mt-2 text-xs sm:text-sm">
            New here?{" "}
            <Link
              to="/auth/register"
              className="text-blue-600 dark:text-blue-400 font-semibold hover:underline transition-colors duration-300"
            >
              Register
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
