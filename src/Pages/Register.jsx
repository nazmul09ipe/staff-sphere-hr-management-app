// @flow strict
import * as React from "react";

import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { use } from "react";


import { AuthContext } from "../Contexts/AuthContext/AuthProvider";
import PageTitle from '../Shared/PageTitle';
import { updateProfile } from 'firebase/auth';


function Register() {
  const { createUser, setUser } = use(AuthContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const email = e.target.email.value;
    const photo = e.target.photo.value;
    const password = e.target.password.value;

    const uppercasePattern = /[A-Z]/;
    const lowercasePattern = /[a-z]/;

    if (password.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }
    if (!uppercasePattern.test(password)) {
      alert("Password must contain at least one uppercase letter.");
      return;
    }
    if (!lowercasePattern.test(password)) {
      alert("Password must contain at least one lowercase letter.");
      return;
    }

    createUser(email, password)
      .then((result) => {
        const user = result.user;
        return updateProfile(user, {
          displayName: name,
          photoURL: photo,
        }).then(() => {
          setUser({ ...user, displayName: name, photoURL: photo });
          navigate("/");
        });
      })
      .catch((error) => {
        console.error("Error during registration:", error);
        alert(error.message);
      });
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-linear-to-br from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-500 p-6">
      <PageTitle title="Register"></PageTitle>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-10">
        Register Your Account
      </h1>

      <div className="bg-white dark:bg-gray-900 shadow-2xl rounded-3xl w-full max-w-md p-8 md:p-10 transition-colors duration-500">
        <form onSubmit={handleRegister} className="flex flex-col gap-6">
      
          <div className="flex flex-col">
            <label className="mb-2 font-medium text-gray-700 dark:text-gray-300">
              Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="Enter your name"
              required
              className="px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            />
          </div>

        
          <div className="flex flex-col">
            <label className="mb-2 font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              required
              className="px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            />
          </div>

         
          <div className="flex flex-col">
            <label className="mb-2 font-medium text-gray-700 dark:text-gray-300">
              Photo URL
            </label>
            <input
              type="text"
              name="photo"
              placeholder="Enter photo URL (optional)"
              className="px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 transition"
            />
          </div>

         
          <div className="flex flex-col relative">
            <label className="mb-2 font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              required
              className="px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 pr-12 focus:outline-none focus:ring-2 focus:ring-green-500 transition w-full"
            />
            <span
              className="absolute right-4 top-2/3 transform -translate-y-1/2 cursor-pointer text-gray-500 dark:text-gray-300"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
            </span>
          </div>

   
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 ml-1">
            <span className="block">• At least 6 characters</span>
            <span className="block">• At least one uppercase letter</span>
            <span className="block">• At least one lowercase letter</span>
          </p>

          <div className="flex items-center gap-3">
            <input type="checkbox" required className="accent-green-500" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              I accept the{" "}
              <Link
                to="/terms"
                className="font-semibold text-red-700 hover:text-blue-600"
              >
                Terms and Conditions
              </Link>
            </span>
          </div>

        
          <button className="w-full py-3 rounded-xl bg-blue-600 dark:bg-green-500 text-white font-semibold hover:bg-blue-700 dark:hover:bg-green-600 transition">
            Register
          </button>

          
          <div className="flex justify-center items-center gap-2 mt-4 text-gray-700 dark:text-gray-300">
            <span>Already have an account?</span>
            <Link
              to="/auth/login"
              className="text-blue-700 dark:text-green-400 font-semibold hover:underline"
            >
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
