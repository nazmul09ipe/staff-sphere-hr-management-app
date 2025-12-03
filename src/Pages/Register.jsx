// @flow strict
import * as React from "react";
import { Link, useNavigate } from "react-router";
import { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { AuthContext } from "../Contexts/AuthContext/AuthProvider";
import PageTitle from "../Shared/PageTitle";
import { updateProfile } from "firebase/auth";
import Swal from "sweetalert2";

function Register() {
  const { createUser, setUser } = React.useContext(AuthContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    const name = e.target.name.value;
    const email = e.target.email.value;
    const role = e.target.role.value;
    const password = e.target.password.value;
    const bank_account_no = e.target.bank.value;
    const salary = e.target.salary.value;
    const designation = e.target.designation.value;
    const photoFile = e.target.photo.files[0];

    if (!role) {
      Swal.fire("Error", "Please select a role (Employee or HR).", "error");
      return;
    }

    // Password validation
    if (password.length < 6) {
      Swal.fire("Error", "Password must be at least 6 characters.", "error");
      return;
    }
    if (!/[A-Z]/.test(password)) {
      Swal.fire("Error", "Password must contain at least one uppercase letter.", "error");
      return;
    }
    if (!/[a-z]/.test(password)) {
      Swal.fire("Error", "Password must contain at least one lowercase letter.", "error");
      return;
    }

    try {
      // -------------------------------
      // 1️⃣ Upload Image to ImgBB
      // -------------------------------
      let photoURL = "";
      if (photoFile) {
        const formData = new FormData();
        formData.append("image", photoFile);

        const res = await fetch(
          `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_KEY}`,
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await res.json();

        if (data.success && data.data && data.data.url) {
          photoURL = data.data.url;
        } else {
          Swal.fire("Error", "Image upload failed. Please try again.", "error");
          return;
        }
      }

      // -------------------------------
      // 2️⃣ Create User in Firebase Auth
      // -------------------------------
      const result = await createUser(email, password);
      const user = result.user;

      await updateProfile(user, {
        displayName: name,
        photoURL,
      });

      // -------------------------------
      // 3️⃣ Save User Data to MongoDB
      // -------------------------------
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

      await fetch("http://localhost:5000/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userInfo),
      });

      setUser({ ...user, displayName: name, photoURL, role });

      // -------------------------------
      // 4️⃣ Success Alert
      // -------------------------------
      Swal.fire({
        icon: "success",
        title: "Registration Successful",
        text: "Your account has been created!",
        confirmButtonColor: "#3085d6",
      });

      navigate("/");
    } catch (error) {
      console.error(error);
      Swal.fire("Error", error.message, "error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-900 dark:to-gray-800 p-6 transition-colors duration-500">
      <PageTitle title="Register" />
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-10">
        Register Your Account
      </h1>

      <div className="bg-white dark:bg-gray-900 shadow-2xl rounded-3xl w-full max-w-md p-8 md:p-10 transition-colors duration-500">
        <form onSubmit={handleRegister} className="flex flex-col gap-6">
          {/* Name */}
          <div>
            <label className="mb-2 font-medium text-gray-700 dark:text-gray-300">Name</label>
            <input type="text" name="name" required placeholder="Enter your name" className="input" />
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input type="email" name="email" required placeholder="Enter your email" className="input" />
          </div>

          {/* Photo Upload */}
          <div>
            <label className="mb-2 font-medium text-gray-700 dark:text-gray-300">Upload Photo</label>
            <input type="file" name="photo" accept="image/*" required className="input" />
          </div>

          {/* Role */}
          <div>
            <label className="mb-2 font-medium text-gray-700 dark:text-gray-300">
              Select Your Role <span className="text-red-600">*</span>
            </label>
            <select name="role" required className="input">
              <option value="">-- Select Role --</option>
              <option value="Employee">Employee</option>
              <option value="HR">HR</option>
            </select>
          </div>

          {/* Bank Account */}
          <div>
            <label className="mb-2 font-medium text-gray-700 dark:text-gray-300">Bank Account Number</label>
            <input type="text" name="bank" required placeholder="Enter bank account" className="input" />
          </div>

          {/* Salary */}
          <div>
            <label className="mb-2 font-medium text-gray-700 dark:text-gray-300">Salary</label>
            <input type="number" name="salary" required placeholder="Salary amount" className="input" />
          </div>

          {/* Designation */}
          <div>
            <label className="mb-2 font-medium text-gray-700 dark:text-gray-300">Designation</label>
            <input type="text" name="designation" required placeholder="Sales Assistant, Marketer, etc." className="input" />
          </div>

          {/* Password */}
          <div className="relative">
            <label className="mb-2 font-medium text-gray-700 dark:text-gray-300">Password</label>
            <input type={showPassword ? "text" : "password"} name="password" required placeholder="Enter your password" className="input pr-10" />
            <span className="absolute right-4 top-10 cursor-pointer text-gray-500" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>

          {/* Terms */}
          <div className="flex items-center gap-3">
            <input type="checkbox" required className="accent-green-500" />
            <span className="text-sm text-gray-700 dark:text-gray-300">
              I accept the{" "}
              <Link to="/terms" className="text-red-600 font-semibold hover:underline">
                Terms and Conditions
              </Link>
            </span>
          </div>

          {/* Register Button */}
          <button className="w-full py-3 rounded-xl bg-blue-600 dark:bg-green-500 text-white font-semibold hover:bg-blue-700 dark:hover:bg-green-600 transition">
            Register
          </button>

          {/* Login Link */}
          <div className="flex justify-center gap-2 mt-4 text-gray-700 dark:text-gray-300">
            <span>Already have an account?</span>
            <Link to="/auth/login" className="text-blue-700 dark:text-green-400 font-semibold hover:underline">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;
