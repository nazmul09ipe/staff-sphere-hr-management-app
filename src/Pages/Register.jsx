import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { AuthContext } from "../Contexts/AuthContext/AuthProvider";
import PageTitle from "../Shared/PageTitle";
import { updateProfile } from "firebase/auth";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";

const API_URL = import.meta.env.VITE_API_URL;

function Register() {
  const { createUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const {
        name,
        email,
        password,
        role,
        bank_account_no,
        salary,
        designation,
        photo,
      } = data;

      /* ---------- IMAGE UPLOAD ---------- */
      let photoURL = "";
      if (photo && photo[0]) {
        const formData = new FormData();
        formData.append("image", photo[0]);

        const key = import.meta.env.VITE_IMGBB_KEY;
        const res = await fetch(
          `https://api.imgbb.com/1/upload?key=${key}`,
          {
            method: "POST",
            body: formData,
          }
        );

        const imgData = await res.json();
        if (imgData.success) {
          photoURL = imgData.data.url;
        }
      }

      /* ---------- FIREBASE REGISTER ---------- */
      const result = await createUser(email, password);
      const user = result.user;

      await updateProfile(user, {
        displayName: name,
        photoURL,
      });

      /* ---------- SAVE USER TO BACKEND ---------- */
      const userInfo = {
        uid: user.uid,
        name,
        email,
        role,
        photo: photoURL,
        bank_account_no,
        salary,
        designation,
      };

      await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userInfo),
      });

      Swal.fire("Success", "Registration completed!", "success");
      reset();
      navigate("/");
    } catch (error) {
      Swal.fire("Error", error.message, "error");
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 dark:bg-gray-900 p-6">
      <PageTitle title="Register" />

      <div className="bg-white dark:bg-gray-800 w-full max-w-lg p-8 rounded-2xl shadow-xl">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-900 dark:text-gray-100">
          Create Account
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* NAME */}
          <input
            className="input"
            placeholder="Full Name"
            {...register("name", { required: true })}
          />

          {/* EMAIL */}
          <input
            type="email"
            className="input"
            placeholder="Email"
            {...register("email", { required: true })}
          />

          {/* PHOTO */}
          <input
            type="file"
            accept="image/*"
            className="input"
            {...register("photo")}
          />

          {/* ROLE */}
          <select className="input" {...register("role", { required: true })}>
            <option value="">Select Role</option>
            <option value="Employee">Employee</option>
            <option value="HR">HR</option>
          </select>

          {/* BANK */}
          <input
            className="input"
            placeholder="Bank Account No"
            {...register("bank_account_no", { required: true })}
          />

          {/* SALARY */}
          <input
            type="number"
            className="input"
            placeholder="Salary"
            {...register("salary", { required: true })}
          />

          {/* DESIGNATION */}
          <input
            className="input"
            placeholder="Designation"
            {...register("designation", { required: true })}
          />

          {/* PASSWORD */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="input pr-10"
              placeholder="Password"
              {...register("password", { required: true, minLength: 6 })}
            />

            {/* 👁 Eye icon – perfectly centered */}
            <span
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-600"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>

          {/* SUBMIT */}
          <button className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold">
            Register
          </button>

          <p className="text-center text-sm">
            Already have an account?{" "}
            <Link to="/auth/login" className="text-blue-600 underline">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Register;
