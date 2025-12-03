import { motion } from "framer-motion";

const ceoTestimonials = [
  {
    name: "Mr. John Smith",
    company: "VF Asia",
    photo: "https://i.ibb.co/Sw4HYVLr/Screenshot-2025-12-02-233227.png",
    feedback:
      "NC Group has consistently impressed us with their product quality and commitment. Their team is professional and always delivers on time.",
  },
  {
    name: "Mr. Anna Lee",
    company: "H&M",
    photo: "https://i.ibb.co/NgkFz1dF/Screenshot-2025-12-02-233259.png",
    feedback:
      "Working with NC Group has been a pleasure. Their dedication to customer satisfaction and high standards of manufacturing is unmatched.",
  },
  {
    name: "Mr. Michael Tan",
    company: "C&A",
    photo: "https://i.ibb.co/Y7wJDmc6/Screenshot-2025-12-02-233323.png",
    feedback:
      "NC Group’s attention to detail and commitment to excellence makes them a reliable partner. We are extremely satisfied with their products and service.",
  },
  {
    name: "Ms. Laura Chen",
    company: "Gap",
    photo: "https://i.ibb.co/QFC3SG7P/Screenshot-2025-12-02-233342.png",
    feedback:
      "The quality and consistency from NC Group are remarkable. Their professionalism and dedication make them a trusted supplier.",
  },
];

const CEOTestimonials = () => {
  return (
    <section className="py-16 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-5">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">
          What Our Honourable Clients Say
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {ceoTestimonials.map((ceo, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg flex flex-col items-center text-center"
            >
              <img
                src={ceo.photo}
                alt={ceo.name}
                className="w-40 h-40 rounded-full object-cover mb-4 border-2 border-blue-600"
              />

              <p className="secondary-font text-gray-700 dark:text-gray-300 mb-4 text-md relative px-4">
                <span className="text-5xl text-blue-600 font-bold absolute -top-4 -left-2">
                  &quot;
                </span>
                {ceo.feedback}
                <span className="text-5xl text-blue-600 font-bold absolute -bottom-4 -right-2">
                  &quot;
                </span>
              </p>

              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                {ceo.name}
              </h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                CEO, {ceo.company}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CEOTestimonials;
