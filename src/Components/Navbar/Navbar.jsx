// Navbar.jsx
import React, { useEffect, useState, useRef, useContext } from "react";
import { useNavigate, useLocation } from "react-router";
import { GoSun } from "react-icons/go";
import { FaMoon } from "react-icons/fa";
import { IoHomeOutline, IoMenu, IoClose } from "react-icons/io5";
import { AuthContext } from "../../Contexts/AuthContext/AuthProvider";
import { motion, AnimatePresence } from "framer-motion";

import logo from "../../assets/logo.png";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";


// Smooth underline animation
const underlineVariants = {
  initial: { width: 0, opacity: 0 },
  hover:   { width: "100%", opacity: 1 },
  active:  { width: "100%", opacity: 1 }
};

// Wrap nav links with underline animation
const LinkUnderline = ({ children, onClick, isActive }) => (
  <div
    className={`cursor-pointer text-lg font-medium relative ${
      isActive ? "text-primary" : "text-gray-700 dark:text-gray-300 hover:text-primary"
    }`}
    onClick={onClick}
  >
    <motion.span
      className="relative inline-block pb-1"
      initial="initial"
      animate={isActive ? "active" : "initial"}
      whileHover="hover"
    >
      {children}

      {/* Underline */}
      <motion.span
        variants={underlineVariants}
        transition={{ duration: 0.28, ease: "easeOut" }}
        className="absolute left-0 bottom-0 h-[2px] bg-primary rounded-full"
      />
    </motion.span>
  </div>
);

const Navbar = () => {
  const { user, logOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const profileRef = useRef(null);
  const [theme, setTheme] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showDashboardMenu, setShowDashboardMenu] = useState(false);

  const isActive = (path) => location.pathname === path;

  /** Theme setup */
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

  /** Close profile if clicked outside */
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogOut = () => {
    logOut();
    
    navigate("/auth/login");
  };

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 left-1/2 -translate-x-1/2 w-11/12 md:w-10/12 z-50 rounded-2xl
      shadow-md bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border border-gray-200/50
      dark:border-gray-700/50"
    >
      <div className="flex justify-between items-center h-24 px-4 md:px-8">
      
        {/* LOGO */}
        <div
          className="flex items-center gap-4 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src={logo}
            alt="FixItNow Logo"
            className="w-20 h-20 md:w-24 md:h-24 rounded-full object-contain shadow-sm transition-transform hover:scale-110"
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

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-8 items-center">
          <LinkUnderline onClick={() => navigate("/")} isActive={isActive("/")}>
            <span className="flex items-center gap-2">
              <IoHomeOutline size={22} /> Home
            </span>
          </LinkUnderline>

          <LinkUnderline
            onClick={() => navigate("/contact")}
            isActive={isActive("/contact")}
          >
            Contact Us
          </LinkUnderline>

            {user && (
              <div
                
              >
                <LinkUnderline
                  onClick={() => navigate("/dashboard")}
                  isActive={location.pathname.startsWith("/dashboard")}
                >
                  Dashboard
                </LinkUnderline>

                
              </div>
            )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4 md:gap-6">

          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(!theme)}
            className="text-2xl p-2 bg-gray-100 dark:bg-gray-800 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            {theme ? <GoSun className="text-yellow-400" /> : <FaMoon />}
          </button>

          {/* Profile or Login */}
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
                data-tooltip-id="profile-tooltip"
                data-tooltip-content={user?.displayName || "User"}
                alt="User"
                onClick={() => setShowProfile(!showProfile)}
                className="w-10 h-10 rounded-full object-cover cursor-pointer border-2 border-primary"
              />
              <Tooltip id="profile-tooltip" place="bottom" />

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
                      onClick={handleLogOut}
                      className="w-full bg-primary text-white py-2 rounded-lg font-semibold hover:bg-blue-600"
                    >
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileMenu(!mobileMenu)}
            className="md:hidden text-3xl text-gray-700 dark:text-gray-200"
          >
            {mobileMenu ? <IoClose /> : <IoMenu />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenu && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-4 px-6 space-y-4"
          >
            <LinkUnderline onClick={() => navigate("/")} isActive={isActive("/")}>
              Home
            </LinkUnderline>

            <LinkUnderline
              onClick={() => navigate("/services")}
              isActive={isActive("/services")}
            >
              Services
            </LinkUnderline>

            {user && (
              <>
                <LinkUnderline
                  onClick={() => navigate("/dashboard")}
                  isActive={location.pathname.startsWith("/dashboard")}
                >
                  Dashboard
                </LinkUnderline>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;