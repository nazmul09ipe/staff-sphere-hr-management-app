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
  const location=useLocation();
  const from=location.state?.from || "/";
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
    <div className="min-h-screen flex justify-center items-center bg-linear-to-b from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <PageTitle title="Login" />

      <div className="bg-white dark:bg-gray-900 shadow-2xl rounded-3xl w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-8">
          Login to Your Account
        </h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              {...register("email", { required: "Email is required" })}
              className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-green-500"
            />
            {errors.email && (
              <p className="text-sm text-red-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="relative">
            <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              {...register("password", { required: "Password is required" })}
              className="w-full px-4 py-3 rounded-xl border pr-12 focus:ring-2 focus:ring-green-500"
            />
            <span
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-11 cursor-pointer text-gray-500"
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
            {errors.password && (
              <p className="text-sm text-red-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Forgot password */}
          <div className="text-right">
            <Link
              to="/auth/forgetPassword"
              className="text-sm text-blue-600 hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Login
          </button>

          {/* Google Login */}
          <button
            type="button"
            onClick={handleLoginWithGoogle}
            className="w-full py-3 rounded-xl border flex items-center justify-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <FcGoogle size={22} />
            <span className="font-medium">Login with Google</span>
          </button>

          {/* Register Link */}
          <p className="text-center text-gray-700 dark:text-gray-300">
            New here?{" "}
            <Link
              to="/auth/register"
              className="text-blue-600 font-semibold hover:underline"
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
