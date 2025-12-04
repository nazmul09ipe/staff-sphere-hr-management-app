// @flow strict
import * as React from "react";

import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

import { auth } from "../../Firebase.config";
import { AuthContext } from '../Contexts/AuthContext/AuthProvider';
import PageTitle from '../Shared/PageTitle';

function Login() {

  // ❗ FIXED
  const { signIn } = React.useContext(AuthContext);

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    signIn(email, password)
      .then(() => navigate("/"))
      .catch((error) => alert(error.message));
  };

  const provider = new GoogleAuthProvider();

  const handleLoginWithGoogle = () => {
    signInWithPopup(auth, provider)
      .then(() => navigate("/"))
      .catch((error) => console.log(error));
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-linear-to-b from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800 p-4 transition-colors duration-500">
     <PageTitle title="Login"></PageTitle>

      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-gray-100 mb-8 sm:mb-10 text-center">
        Login to Your Account
      </h1>

      <div className="bg-white dark:bg-gray-900 shadow-2xl rounded-3xl w-full max-w-md p-6 sm:p-8 md:p-10 transition-colors duration-500">
        <form onSubmit={handleLogin} className="flex flex-col gap-5 sm:gap-6">
         
          <div className="flex flex-col">
            <label className="mb-2 font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-white/80 dark:bg-gray-800/80 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-green-500 transition w-full"
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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

         
          <div className="text-right">
            <Link
              to="/auth/forgetPassword"
              state={{ email }}
              className="text-sm text-blue-700 dark:text-green-400 hover:underline transition"
            >
              Forgot Password?
            </Link>
          </div>

         
          <button className="w-full py-3 rounded-xl bg-blue-600 dark:bg-green-500 text-white font-semibold hover:bg-blue-700 dark:hover:bg-green-600 transition">
            Login
          </button>

       
          <button
            type="button"
            onClick={handleLoginWithGoogle}
            className="w-full py-3 rounded-xl border border-gray-300 dark:border-gray-700 flex items-center justify-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <FcGoogle size={24} />
            <span className="text-gray-800 dark:text-gray-100 font-medium">
              Login with Google
            </span>
          </button>

       
          <div className="flex justify-center items-center gap-2 mt-4 text-gray-700 dark:text-gray-300 flex-wrap text-center">
            <span>New to FixItNow?</span>
            <Link
              to="/auth/register"
              className="text-blue-700 dark:text-green-400 font-semibold hover:underline"
            >
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
