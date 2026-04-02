import React, { useEffect, useState } from "react";
import CountUp from "react-countup";
import {
  FaUsers,
  FaBoxOpen,
  FaShoppingCart,
  FaGlobe,
  FaAward,
} from "react-icons/fa";

// Stats Data
const statsData = [
  { label: "Employees", value: 3500, suffix: "+", icon: <FaUsers /> },
  { label: "Product Variations", value: 30, suffix: "+", icon: <FaBoxOpen /> },
  { label: "Buyers", value: 250, suffix: "+", icon: <FaShoppingCart /> },
  { label: "Exported Countries", value: 20, suffix: "+", icon: <FaGlobe /> },
  { label: "Certifications", value: 20, suffix: "+", icon: <FaAward /> },
];

const StatsDashboard = () => {
  const [visible, setVisible] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Scroll trigger
  useEffect(() => {
    const handleScroll = () => {
      const el = document.getElementById("stats-dashboard");
      if (!el) return;
      const rect = el.getBoundingClientRect();
      if (rect.top <= window.innerHeight - 100) setVisible(true);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Dark mode detection
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const updateTheme = (e) => setIsDarkMode(e.matches);
    setIsDarkMode(media.matches);

    if (media.addEventListener) {
      media.addEventListener("change", updateTheme);
    } else {
      media.addListener(updateTheme);
    }

    return () => {
      if (media.removeEventListener) {
        media.removeEventListener("change", updateTheme);
      } else {
        media.removeListener(updateTheme);
      }
    };
  }, []);

  // Styles
  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      flexWrap: "wrap",
      gap: "2.5rem",
      padding: "4rem 6rem",
      background: isDarkMode
        ? "linear-gradient(135deg, #0f172a, #020617)"
        : "linear-gradient(135deg, #e0f2fe, #eef2ff)",
    },

    card: {
      background: isDarkMode
        ? "linear-gradient(135deg, #1e293b, #0f172a)"
        : "linear-gradient(135deg, #ffffff, #f8fafc)",
      padding: "2.5rem 2rem",
      borderRadius: "16px",
      textAlign: "center",
      boxShadow: isDarkMode
        ? "0 10px 25px rgba(0,0,0,0.6)"
        : "0 10px 25px rgba(0,0,0,0.1)",
      flex: "1 1 200px",
      minWidth: "180px",
      maxWidth: "240px",
      transition: "all 0.3s ease",
    },

    cardHover: {
      transform: "translateY(-8px)",
      boxShadow: isDarkMode
        ? "0 20px 35px rgba(0,0,0,0.7)"
        : "0 20px 35px rgba(0,0,0,0.15)",
    },

    // ✅ Centered Icon
    iconWrapper: {
      display: "flex",
      justifyContent: "center",
      marginBottom: "1rem",
    },

    icon: {
      fontSize: "1.6rem",
      color: "#fff",
      background: isDarkMode
        ? "linear-gradient(135deg, #38bdf8, #6366f1)"
        : "linear-gradient(135deg, #2563eb, #7c3aed)",
      padding: "12px",
      borderRadius: "50%",
      boxShadow: "0 6px 15px rgba(0,0,0,0.2)",
    },

    count: {
      fontSize: "2.4rem",
      fontWeight: "700",
      color: isDarkMode ? "#f1f5f9" : "#0f172a",
      marginBottom: "0.5rem",
    },

    label: {
      fontSize: "0.95rem",
      color: isDarkMode ? "#cbd5f5" : "#64748b",
      letterSpacing: "0.5px",
    },
  };

  return (
    <div id="stats-dashboard" style={styles.container}>
      {statsData.map((stat, index) => (
        <div
          key={index}
          style={styles.card}
          onMouseEnter={(e) =>
            (e.currentTarget.style.transform = styles.cardHover.transform)
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.transform = "none")
          }
        >
          {/* Centered Icon */}
          <div style={styles.iconWrapper}>
            <div style={styles.icon}>{stat.icon}</div>
          </div>

          <div style={styles.count}>
            {visible ? (
              <CountUp end={stat.value} duration={2.5} separator="," />
            ) : (
              0
            )}
            {stat.suffix}
          </div>

          <div style={styles.label}>{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

export default StatsDashboard;