import React, { useEffect, useState, useRef, useContext } from "react";
import { useNavigate, useLocation } from "react-router";
import { GoSun } from "react-icons/go";
import { FaMoon } from "react-icons/fa";
import { IoHomeOutline, IoMenu, IoClose } from "react-icons/io5";

import { motion, AnimatePresence } from "framer-motion";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

import logo from "../../assets/logo.png";
import AuthContext from "../../Contexts/AuthContext/AuthContext";

const underlineVariants = {
  initial: { scaleX: 0, opacity: 0, originX: 0 },
  hover: { scaleX: 1, opacity: 1, originX: 0, transition: { duration: 0.35 } },
  active: { scaleX: 1, opacity: 1 },
};

const centerUnderlineVariants = {
  initial: { scaleX: 0, originX: 0.5, opacity: 0 }, // start from center
  hover: { scaleX: 1, originX: 0.5, opacity: 1, transition: { duration: 0.35, ease: "easeOut" } },
  active: { scaleX: 1, originX: 0.5, opacity: 1 },
};

const LinkUnderline = ({ children, isActive, onClick }) => (
  <motion.div
    onClick={onClick}
    className={`cursor-pointer text-lg font-medium relative transition-colors duration-300 ${
      isActive
        ? "text-cyan-200"
        : "text-white/90 hover:text-white"
    }`}
    whileHover="hover"
    animate={isActive ? "active" : "initial"}
  >
    <motion.span className="inline-block relative pb-1">
      {children}
      <motion.span
        className={`absolute left-0 bottom-0 h-[2px] w-full rounded-full ${
          isActive ? "bg-cyan-200" : "bg-white/70"
        }`}
        variants={centerUnderlineVariants}
      />
    </motion.span>
  </motion.div>
);

const Navbar = () => {
  const { user, role, logOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const profileRef = useRef(null);

  const [theme, setTheme] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const isActive = (path) => location.pathname === path;

  // Theme handling
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

  // Close profile dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logOut();
    navigate("/auth/login");
  };

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 left-1/2 -translate-x-1/2 w-11/12 md:w-10/12 z-50
        rounded-2xl shadow-lg
        bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400 dark:from-gray-800 dark:via-gray-900 dark:to-gray-700
        border border-gray-200/30 dark:border-gray-700/30 backdrop-blur-md"
    >
      <div className="flex justify-between items-center h-24 px-4 md:px-8">
        {/* LOGO */}
        <div
          className="flex items-center gap-4 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <img
            src={logo}
            alt="NC Group Logo"
            className="w-20 h-20 md:w-24 md:h-24 rounded-full object-contain transition-transform hover:scale-110"
          />
          <div>
            <h1 className="font-bold text-3xl md:text-4xl text-white tracking-wide">
              NC Group
            </h1>
            <p className="text-sm text-white/80 mt-1">
              Crafting Quality with Commitment
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

          <LinkUnderline
            isActive={isActive("/contact")}
            onClick={() => navigate("/contact")}
          >
            Contact
          </LinkUnderline>

          {user && (
            <LinkUnderline
              isActive={location.pathname.startsWith("/dashboard")}
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </LinkUnderline>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="flex items-center gap-4 md:gap-6">
          {/* Theme Toggle */}
          <button
            onClick={() => setTheme(!theme)}
            className="text-2xl p-2 bg-white/20 dark:bg-gray-700/40 rounded-full hover:bg-white/40 dark:hover:bg-gray-600/60 transition-colors"
          >
            {theme ? <GoSun className="text-yellow-400" /> : <FaMoon className="text-white" />}
          </button>

          {/* Profile / Login */}
          {!user ? (
            <button
              onClick={() => navigate("/auth/login")}
              className="bg-white/30 text-white font-semibold px-5 py-2 rounded-xl hover:bg-white/60 hover:shadow-lg transition"
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
                className="w-10 h-10 rounded-full border-2 border-white cursor-pointer object-cover transition-transform hover:scale-105"
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
                      className="w-full bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400 text-white py-2 rounded-lg font-semibold hover:from-purple-700 hover:via-blue-600 hover:to-cyan-500 transition"
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
            className="md:hidden text-3xl text-white/90"
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
            className="md:hidden bg-gradient-to-r from-purple-600 via-blue-500 to-cyan-400 dark:from-gray-800 dark:via-gray-900 dark:to-gray-700
              border-t border-gray-200/30 dark:border-gray-700/30 py-5 px-6 space-y-5"
          >
            <LinkUnderline
              isActive={isActive("/")}
              onClick={() => navigate("/")}
            >
              Home
            </LinkUnderline>

            <LinkUnderline
              isActive={isActive("/contact")}
              onClick={() => navigate("/contact")}
            >
              Contact
            </LinkUnderline>

            {user && (
              <LinkUnderline
                isActive={location.pathname.startsWith("/dashboard")}
                onClick={() => navigate("/dashboard")}
              >
                Dashboard
              </LinkUnderline>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;