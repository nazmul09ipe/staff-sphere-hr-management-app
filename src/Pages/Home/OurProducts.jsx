import { useState } from "react";
import { motion } from "framer-motion";

const products = [
  { name: "Cargo Pant", image: "https://i.ibb.co/gsXy5wR/Screenshot-2025-12-02-224534.png" },
  { name: "T-Shirt", image: "https://i.ibb.co/gb0Rq4Wc/Screenshot-2025-12-02-224621.png" },
  { name: "Polo-Shirt", image: "https://i.ibb.co/BVK9f8tS/Screenshot-2025-12-02-224650.png" },
  { name: "Chino Pant", image: "https://i.ibb.co/Zp5KNdXd/Screenshot-2025-12-02-224714.png" },
  { name: "Padding Jacket", image: "https://i.ibb.co/FL1n1HNz/Screenshot-2025-12-02-224813.png" },
  { name: "Overall", image: "https://i.ibb.co/HDTt9Y4n/Screenshot-2025-12-02-224842.png" },
  { name: "Coverall", image: "https://i.ibb.co/3xLdPBF/Screenshot-2025-12-02-225005.png" },
  { name: "Jacket", image: "https://i.ibb.co/8gQYXkbZ/Screenshot-2025-12-02-231038.png" },
  { name: "Suit", image: "https://i.ibb.co/ycbb9rj5/Screenshot-2026-04-02-180651.png" },
  { name: "Shirt", image: "https://i.ibb.co/1fG5JTpT/Screenshot-2026-04-02-180947.png" },
  { name: "Jeans", image: "https://i.ibb.co/kV7jCqDZ/Screenshot-2026-04-02-181215.png" },
  { name: "Sweater", image: "https://i.ibb.co/yFyZLM5j/Screenshot-2026-04-02-181820.png" },
];

const OurProducts = () => {
  const [showAll, setShowAll] = useState(false);
  const displayedProducts = showAll ? products : products.slice(0, 8);

  return (
    <section id="our-products" className="py-16 bg-gray-50 dark:bg-gray-900 mb-20">
      <div className="max-w-7xl mx-auto px-5 sm:px-10 lg:px-20">
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white text-center mb-12">
          Our Products
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
          {displayedProducts.map((product, index) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-64 sm:h-56 md:h-64 lg:h-64 object-cover"
              />
              <div className="p-4 text-center">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {product.name}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Read More / Show Less Button */}
        {products.length > 8 && (
          <div className="mt-8 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-full transition"
            >
              {showAll ? "Show Less" : "Read More"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default OurProducts;