import * as React from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";

import toast from "react-hot-toast";
import { auth } from "../../Firebase.config";

function ForgetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const passedEmail = location.state?.email || "";
  const [email, setEmail] = useState(passedEmail);
  const [loading, setLoading] = useState(false);

  const handleForgetPassword = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter a valid email address.", {
        style: {
          background: "#ef4444",
          color: "#fff",
          fontWeight: 500,
        },
      });
      return;
    }

    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email);
      toast.success("Reset link sent! Check your email.", {
        style: {
          background: "#16a34a",
          color: "white",
          fontWeight: 500,
        },
      });
      setTimeout(() => navigate("/auth/login"), 1500);
    } catch (error) {
      toast.error(error.message || "Something went wrong.", {
        style: {
          background: "#b91c1c",
          color: "white",
          fontWeight: 500,
        },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center px-4 bg-linear-to-br from-slate-100 to-slate-300 dark:from-gray-900 dark:to-gray-800 transition-all duration-500">
      <div className="w-full max-w-md bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg shadow-xl rounded-3xl p-8 border border-gray-300 dark:border-gray-700 transition-all duration-300">
        <h1 className="text-3xl font-bold text-center text-cyan-900 dark:text-cyan-400 mb-6">
          Reset Your Password
        </h1>

        <p className="text-center text-gray-700 dark:text-gray-300 mb-6 text-sm">
          Enter your email address below and we’ll send you a password reset link.
        </p>

        <form onSubmit={handleForgetPassword} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-800 dark:text-gray-200 mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-cyan-600 dark:focus:ring-cyan-400 transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-cyan-700 hover:bg-cyan-800 dark:bg-cyan-600 dark:hover:bg-cyan-500 text-white font-semibold transition-all duration-300 disabled:opacity-60"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/auth/login")}
            className="text-cyan-800 dark:text-cyan-400 hover:underline text-sm"
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default ForgetPassword;
