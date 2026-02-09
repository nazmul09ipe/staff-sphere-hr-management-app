import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Swal from "sweetalert2";
import axios from "axios";

import PageTitle from "../Shared/PageTitle";
import useAxiosSecure from "../Hooks/useAxiosSecure";
import AuthContext from "../Contexts/AuthContext/AuthContext";

const Register = () => {
  const { createUser, updateUserProfile } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      await createUser(data.email, data.password);

      let photoURL = "";

      if (data.photo?.[0]) {
        const formData = new FormData();
        formData.append("image", data.photo[0]);

        const imgRes = await axios.post(
          `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_KEY}`,
          formData
        );

        photoURL = imgRes.data.data.url;
      }

      await updateUserProfile({
        displayName: data.name,
        photoURL,
      });

      const userInfo = {
        name: data.name,
        email: data.email,
        photoURL,
        role: data.role,
        bank_account_no: data.bank_account_no,
        salary: Number(data.salary),
        designation: data.designation,
        isVerified: false,
      };

      await axiosSecure.post("/users", userInfo);

      Swal.fire("Success", "Account created successfully", "success");

      reset();
      navigate("/");

    } catch (error) {
      Swal.fire("Error", error.message, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-linear-to-br from-slate-100 to-slate-200 p-6">
      <PageTitle title="Register" />

      <div className="bg-white w-full max-w-xl p-10 rounded-2xl shadow-2xl">

        <h2 className="text-3xl font-bold text-center mb-2">
          Create Account
        </h2>

        <p className="text-center text-gray-500 mb-6">
          Register as Employee or HR
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* NAME */}
          <input className="input input-bordered w-full" placeholder="Full Name" {...register("name", { required: "Name is required" })} />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

          {/* PHOTO */}
          <input type="file" className="file-input file-input-bordered w-full" {...register("photo")} />

          {/* EMAIL */}
          <input className="input input-bordered w-full" placeholder="Email" {...register("email", { required: "Email is required" })} />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

          {/* ROLE */}
          <select className="select select-bordered w-full" {...register("role", { required: "Role is required" })}>
            <option value="">Select Role</option>
            <option value="employee">Employee</option>
            <option value="hr">HR</option>
          </select>
          {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}

          {/* BANK */}
          <input className="input input-bordered w-full" placeholder="Bank Account Number" {...register("bank_account_no", { required: "Bank account required" })} />
          {errors.bank_account_no && <p className="text-red-500 text-sm">{errors.bank_account_no.message}</p>}

          {/* SALARY */}
          <input type="number" className="input input-bordered w-full" placeholder="Salary" {...register("salary", { required: "Salary required" })} />
          {errors.salary && <p className="text-red-500 text-sm">{errors.salary.message}</p>}

          {/* DESIGNATION */}
          <input className="input input-bordered w-full" placeholder="Designation" {...register("designation", { required: "Designation required" })} />
          {errors.designation && <p className="text-red-500 text-sm">{errors.designation.message}</p>}

          {/* PASSWORD */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="input input-bordered w-full pr-10"
              placeholder="Password"
              {...register("password", {
                required: "Password required",
                minLength: { value: 6, message: "Minimum 6 characters" },
                pattern: {
                  value: /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/,
                  message: "Must contain upper, lower, number & symbol",
                },
              })}
            />

            <span className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>

          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password.message}</p>
          )}

          <p className="text-xs text-gray-400">
            Password must contain uppercase, lowercase, number & symbol.
          </p>

          <button disabled={loading} className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">
            {loading ? "Creating..." : "Register"}
          </button>

          <p className="text-center text-sm font-semibold">
            Already have account?
            <Link to="/auth/login" className="text-blue-500 underline ml-1">
              Login
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
};

export default Register;
