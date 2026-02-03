// Navbar.jsx
import React, { useEffect, useState, useRef, useContext } from "react";
import { useNavigate, useLocation } from "react-router";
import { GoSun } from "react-icons/go";
import { FaMoon } from "react-icons/fa";
import { IoHomeOutline, IoMenu, IoClose } from "react-icons/io5";
import { AuthContext } from "../../Contexts/AuthContext/AuthProvider";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

import logo from "../../assets/logo.png";

/* --------------------------------------------------------
   SMOOTH UNDERLINE VARIANTS
--------------------------------------------------------- */
const underlineVariants = {
  initial: { scaleX: 0, opacity: 0, originX: 0 },
  hover: { scaleX: 1, opacity: 1, originX: 0, transition: { duration: 0.35 } },
  active: { scaleX: 1, opacity: 1 }
};

const LinkUnderline = ({ children, isActive, onClick }) => (
  <motion.div
    onClick={onClick}
    className={`cursor-pointer text-lg font-medium relative ${
      isActive ? "text-primary" : "text-gray-700 dark:text-gray-300"
    }`}
    whileHover="hover"
    animate={isActive ? "active" : "initial"}
  >
    <motion.span className="inline-block relative pb-1">
      {children}

      {/* Animated underline */}
      <motion.span
        className="absolute left-0 bottom-0 h-[2px] w-full bg-primary rounded-full"
        variants={underlineVariants}
      />
    </motion.span>
  </motion.div>
);

/* --------------------------------------------------------
   NAVBAR MAIN
--------------------------------------------------------- */
const Navbar = () => {
  const { user, role, logOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const profileRef = useRef(null);

  const [theme, setTheme] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const isActive = (path) => location.pathname === path;

  /* -------------------- THEME -------------------- */
  useEffect(() => {
    const stored = localStorage.getItem("theme") === "dark";
    setTheme(stored);
  }, []);

  useEffect(() => {
    if (theme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  /* -------------------- CLOSE PROFILE ON OUTSIDE CLICK -------------------- */
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* -------------------- LOGOUT -------------------- */
  const handleLogout = () => {
    logOut();
    navigate("/auth/login");
  };

  /* -------------------- ROLE-WISE DASHBOARD PATH -------------------- */
  const getDashboardPath = () => {
    if (role === "employee") return "/dashboard/work-sheet";
    if (role === "hr") return "/dashboard/employee-list";
    if (role === "admin") return "/dashboard/all-employee-list";
    return "/dashboard";
  };

  /* ============================================================
        FINAL NAVBAR UI
  ============================================================ */
  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 left-1/2 -translate-x-1/2 w-11/12 md:w-10/12 z-50
        rounded-2xl shadow-md bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl
        border border-gray-200/50 dark:border-gray-700/50"
    >
      <div className="flex justify-between items-center h-24 px-4 md:px-8">

        {/* LOGO */}
        <div className="flex items-center gap-4 cursor-pointer" onClick={() => navigate("/")}>
          <img
            src={logo}
            alt="NC Group Logo"
            className="w-20 h-20 md:w-24 md:h-24 rounded-full object-contain transition-transform hover:scale-110"
          />
          <div>
            <h1 className="font-bold text-3xl md:text-4xl text-primary tracking-wide">
              NC Group
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 -mt-1">
              Where Quality Meets Precision
            </p>
          </div>
        </div>

        {/* DESKTOP NAV */}
        <div className="hidden md:flex gap-10 items-center">

          <LinkUnderline isActive={isActive("/")} onClick={() => navigate("/")}>
            <span className="flex items-center gap-2">
              <IoHomeOutline size={22} /> Home
            </span>
          </LinkUnderline>

          <LinkUnderline isActive={isActive("/contact")} onClick={() => navigate("/contact")}>
            Contact
          </LinkUnderline>

          {user && role && (
            <LinkUnderline
              isActive={location.pathname.startsWith("/dashboard")}
              onClick={() => navigate(getDashboardPath())}
            >
              {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard
            </LinkUnderline>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4 md:gap-6">

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(!theme)}
            className="text-2xl p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {theme ? <GoSun className="text-yellow-400" /> : <FaMoon />}
          </button>

          {/* Profile OR Login */}
          {!user ? (
            <button
              onClick={() => navigate("/auth/login")}
              className="bg-primary text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-600"
            >
              Login
            </button>
          ) : (
            <div ref={profileRef} className="relative">
              <img
                src={user?.photoURL || "/default-avatar.png"}
                data-tooltip-id="profile-tip"
                data-tooltip-content={user?.displayName || "User"}
                onClick={() => setShowProfile(!showProfile)}
                alt="User"
                className="w-10 h-10 rounded-full border-2 border-primary cursor-pointer object-cover"
              />
              <Tooltip id="profile-tip" place="bottom" />

              <AnimatePresence>
                {showProfile && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="absolute right-0 mt-3 w-56 p-4 bg-white dark:bg-gray-800 
                      border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl z-[999]"
                  >
                    <p className="text-sm text-gray-500">Signed in as</p>
                    <p className="font-semibold">{user?.displayName}</p>
                    <p className="text-xs text-gray-500 mb-3">{user?.email}</p>

                    <button
                      onClick={handleLogout}
                      className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-blue-600"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="md:hidden text-3xl text-gray-700 dark:text-gray-200"
          >
            {mobileMenu ? <IoClose /> : <IoMenu />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 
            py-5 px-6 space-y-5"
          >
            <LinkUnderline isActive={isActive("/")} onClick={() => navigate("/")}>
              Home
            </LinkUnderline>

            <LinkUnderline isActive={isActive("/contact")} onClick={() => navigate("/contact")}>
              Contact
            </LinkUnderline>

            {user && role && (
              <LinkUnderline
                isActive={location.pathname.startsWith("/dashboard")}
                onClick={() => navigate(getDashboardPath())}
              >
                {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard
              </LinkUnderline>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;