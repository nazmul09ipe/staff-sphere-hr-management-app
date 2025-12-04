import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { AuthContext } from "../Contexts/AuthContext/AuthProvider";
import PageTitle from "../Shared/PageTitle";
import { updateProfile } from "firebase/auth";
import Swal from "sweetalert2";

function Register() {
  const { createUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const API_URL = "http://localhost:5000";

  const handleRegister = async (e) => {
    e.preventDefault();
    const name = e.target.name.value.trim();
    const email = e.target.email.value.trim();
    const role = e.target.role.value.toLowerCase();
    const password = e.target.password.value;
    const designation = e.target.designation.value.trim();
    const salary = e.target.salary.value;
    const bank_account_no = e.target.bank.value.trim();
    const photoFile = e.target.photo.files[0];

    // password validation
    if (password.length < 6) {
      Swal.fire("Error", "Password must be at least 6 characters", "error");
      return;
    }
    if (!/[A-Z]/.test(password)) {
      Swal.fire("Error", "Password must contain one uppercase letter", "error");
      return;
    }

    try {
      // Upload image (if selected)
      let photoURL = "";
      if (photoFile) {
        const formData = new FormData();
        formData.append("image", photoFile);

        const key = import.meta.env.VITE_IMGBB_KEY;
        const upload = await fetch(`https://api.imgbb.com/1/upload?key=${key}`, {
          method: "POST",
          body: formData,
        });

        const imgRes = await upload.json();
        if (imgRes.success) {
          photoURL = imgRes.data.url;
        }
      }

      // Firebase registration
      const result = await createUser(email, password);
      const user = result.user;

      await updateProfile(user, {
        displayName: name,
        photoURL,
      });

      // Save full user info to backend
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

      Swal.fire({
        icon: "success",
        title: "Registration Successful",
        text: "Welcome to NC Group!",
      });

      // Navigate to HOME → Dashboard will load automatically
      navigate("/");

    } catch (err) {
      Swal.fire("Error", err.message, "error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-gray-50 dark:bg-gray-900">
      <PageTitle title="Register" />

      <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
        Create Your Account
      </h1>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-lg p-8 space-y-6">

        <form onSubmit={handleRegister} className="space-y-5">

          {/* NAME */}
          <div>
            <label className="label">Full Name</label>
            <input name="name" required className="input" placeholder="John Doe" />
          </div>

          {/* EMAIL */}
          <div>
            <label className="label">Email</label>
            <input name="email" type="email" required className="input" placeholder="example@mail.com" />
          </div>

          {/* PROFESSIONAL PHOTO UPLOAD */}
          <div>
            <label className="label">Upload Photo</label>

            <div className="border-2 border-dashed border-gray-400 dark:border-gray-600 p-3 rounded-xl hover:border-blue-500 transition cursor-pointer bg-gray-50 dark:bg-gray-700">
              <input
                name="photo"
                type="file"
                accept="image/*"
                className="w-full text-gray-700 dark:text-gray-200 file:mr-4 file:py-2 file:px-4 
                file:rounded-lg file:border-0 file:text-sm file:bg-blue-100 dark:file:bg-blue-900 
                file:text-blue-700 dark:file:text-blue-200 hover:file:bg-blue-200 dark:hover:file:bg-blue-800"
              />
            </div>
          </div>

          {/* ROLE */}
          <div>
            <label className="label">Role</label>
            <select name="role" required className="input">
              <option value="">Select role</option>
              <option value="Employee">Employee</option>
              <option value="HR">HR</option>
            </select>
          </div>

          {/* BANK */}
          <div>
            <label className="label">Bank Account No</label>
            <input name="bank" required className="input" placeholder="1234567890" />
          </div>

          {/* SALARY */}
          <div>
            <label className="label">Salary</label>
            <input name="salary" type="number" required className="input" placeholder="Enter salary" />
          </div>

          {/* DESIGNATION */}
          <div>
            <label className="label">Designation</label>
            <input name="designation" required className="input" placeholder="e.g., Sales Executive" />
          </div>

          {/* PASSWORD */}
          <div className="relative">
            <label className="label">Password</label>
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              required
              className="input pr-12"
              placeholder="••••••••"
            />
            <span
              className="absolute right-3 top-11 -translate-y-1/2 cursor-pointer text-gray-600 dark:text-gray-300"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
            </span>
          </div>

          {/* TERMS */}
          <div className="flex items-center gap-2">
            <input type="checkbox" required />
            <label className="text-sm text-gray-700 dark:text-gray-300">
              I agree to the{" "}
              <Link to="/terms" className="text-blue-600 dark:text-blue-300 underline">
                Terms & Conditions
              </Link>
            </label>
          </div>

          {/* SUBMIT BUTTON */}
          <button className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-lg shadow-md transition">
            Register
          </button>

          <p className="text-center text-sm text-gray-600 dark:text-gray-300">
            Already have an account?{" "}
            <Link to="/auth/login" className="text-blue-600 dark:text-blue-300 underline">
              Login
            </Link>
          </p>

        </form>
      </div>
    </div>
  );
}

export default Register;
