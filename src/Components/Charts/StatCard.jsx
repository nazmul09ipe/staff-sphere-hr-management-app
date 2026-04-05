import { motion } from "framer-motion";

const StatCard = ({ title, value, icon, color }) => {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white/70 dark:bg-[#1e293b]/70 backdrop-blur-lg border border-gray-200 dark:border-gray-700 p-5 rounded-2xl shadow-sm flex items-center gap-4"
    >
      <div className={`text-3xl ${color}`}>{icon}</div>
      <div>
        <p className="text-xs text-gray-500">{title}</p>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
          {value}
        </h2>
      </div>
    </motion.div>
  );
};

export default StatCard;