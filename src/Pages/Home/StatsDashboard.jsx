import { useEffect, useState } from "react";
import CountUp from "react-countup";
import { FaUsers, FaBoxOpen, FaShoppingCart, FaGlobe, FaAward } from "react-icons/fa";

const statsData = [
  { label: "Employees", value: 3500, suffix: "+", icon: <FaUsers /> },
  { label: "Product Variations", value: 30, suffix: "+", icon: <FaBoxOpen /> },
  { label: "Buyers", value: 250, suffix: "+", icon: <FaShoppingCart /> },
  { label: "Exported Countries", value: 20, suffix: "+", icon: <FaGlobe /> },
  { label: "Certifications", value: 20, suffix: "+", icon: <FaAward /> },
];

const StatsDashboard = () => {
  const [visible, setVisible] = useState(false);

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

  return (
    <section
      id="stats-dashboard"
      className="py-16 px-5 sm:px-10 lg:px-20 bg-gradient-to-r from-sky-100 to-indigo-100 dark:from-gray-900 dark:to-gray-800"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 sm:gap-8">
        {statsData.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-2 duration-300 flex flex-col items-center justify-center p-6"
          >
            {/* Icon */}
            <div className="flex justify-center items-center mb-4 w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl shadow-md">
              {stat.icon}
            </div>

            {/* Count */}
            <div className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              {visible ? (
                <CountUp end={stat.value} duration={2.5} separator="," />
              ) : (
                0
              )}
              {stat.suffix}
            </div>

            {/* Label */}
            <div className="text-gray-500 dark:text-gray-300 text-sm sm:text-base tracking-wide text-center">
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StatsDashboard;