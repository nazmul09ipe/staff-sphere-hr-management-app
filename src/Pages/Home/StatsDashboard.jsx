import React, { useEffect, useState } from "react";
import CountUp from "react-countup";
import { FaUsers, FaBoxOpen, FaShoppingCart, FaGlobe, FaAward } from "react-icons/fa";

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

  // Scroll-triggered visibility
  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById("stats-dashboard");
      if (!element) return;
      const rect = element.getBoundingClientRect();
      if (rect.top <= window.innerHeight - 100) {
        setVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // initial check

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Inline styles for self-contained component
  const styles = {
    container: {
      display: "flex",
      justifyContent: "space-around",
      flexWrap: "wrap",
      gap: "2rem",
      padding: "2rem",
      backgroundColor: "#f5f7fa",
    },
    card: {
      background: "linear-gradient(135deg, #ffffff, #f0f4f8)",
      padding: "2rem",
      borderRadius: "15px",
      textAlign: "center",
      boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
      flex: "1 1 180px",
      transition: "transform 0.3s, box-shadow 0.3s",
      cursor: "default",
    },
    cardHover: {
      transform: "translateY(-5px)",
      boxShadow: "0 15px 25px rgba(0,0,0,0.15)",
    },
    icon: {
      fontSize: "2.5rem",
      color: "#0070f3",
      marginBottom: "1rem",
    },
    count: {
      fontSize: "2rem",
      fontWeight: "bold",
      color: "#111827",
      marginBottom: "0.5rem",
    },
    label: {
      fontSize: "1rem",
      color: "#6b7280",
    },
  };

  return (
    <div id="stats-dashboard" style={styles.container}>
      {statsData.map((stat, index) => (
        <div
          key={index}
          style={styles.card}
          className="stat-card"
          onMouseEnter={(e) => e.currentTarget.style.transform = styles.cardHover.transform}
          onMouseLeave={(e) => e.currentTarget.style.transform = "none"}
        >
          <div style={styles.icon}>{stat.icon}</div>
          <div style={styles.count}>
            {visible ? (
              <CountUp
                end={stat.value}
                duration={2.5}
                separator=","
              /> 
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