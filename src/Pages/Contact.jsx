import { motion } from "framer-motion";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import { useState } from "react";
import PageTitle from "../Shared/PageTitle";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://assignment-11-server-side-vert.vercel.app/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Message sent successfully!", {
          duration: 3000,
          style: {
            background: "#ff5376",
            color: "white",
            fontWeight: "500",
          },
        });
        setFormData({ name: "", email: "", message: "" });
      } else {
        toast.error("Failed to send message!");
      }
    } catch (error) {
      console.error("Error submitting message:", error);
      toast.error("Something went wrong!");
    }
  };

  return (
    <div
      className="min-h-screen pt-28 sm:pt-28 mt-10
      bg-linear-to-br from-gray-50 via-white to-blue-50 
      dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 
      text-gray-900 dark:text-gray-100 px-4 pb-12"
    >
      <PageTitle title="Contact" />

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center pb-10 md:pb-12"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-brand mb-3">
          Get in Touch
        </h1>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto text-sm md:text-base">
          Have questions, need help, or want to work with us?  
          Drop us a message and we’ll get back to you as soon as possible.
        </p>
      </motion.div>

      {/* Contact Info & Form */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

        {/* Contact Information */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-200 dark:border-gray-700 p-8 space-y-6"
        >
          <h2 className="text-2xl font-semibold text-brand mb-4">
            Contact Information
          </h2>

          <div className="flex items-start gap-4">
            <FaPhoneAlt className="text-brand text-xl mt-1" />
            <div>
              <h3 className="font-medium">Phone</h3>
              <p className="text-gray-600 dark:text-gray-400">
                +880 1712-345678
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <FaEnvelope className="text-brand text-xl mt-1" />
            <div>
              <h3 className="font-medium">Email</h3>
              <p className="text-gray-600 dark:text-gray-400">
                hello@ncgroup.com
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <FaMapMarkerAlt className="text-brand text-xl mt-1" />
            <div>
              <h3 className="font-medium">Office</h3>
              <p className="text-gray-600 dark:text-gray-400">
                123 HR Avenue, Dhaka, Bangladesh
              </p>
            </div>
          </div>

          <iframe
            className="w-full h-56 md:h-64 rounded-2xl border border-gray-300 dark:border-gray-700 mt-4"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3651.902820127507!2d90.3912354149823!3d23.750885394595204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b6b7b3a3a1%3A0x8b0f4e39a0e6bb09!2sDhaka%2C%20Bangladesh!5e0!3m2!1sen!2sbd!4v1678980025111!5m2!1sen!2sbd"
            allowFullScreen=""
            loading="lazy"
            title="NC Group Office Location"
          ></iframe>
        </motion.div>

        {/* Contact Form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-200 dark:border-gray-700 p-8 space-y-5"
        >
          <h2 className="text-2xl font-semibold text-brand mb-4">
            Send a Message
          </h2>

          <div className="form-control">
            <label className="label font-semibold text-gray-700 dark:text-gray-200">
              Your Name
            </label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              value={formData.name}
              onChange={handleChange}
              className="input input-bordered w-full bg-white dark:bg-gray-900 focus:ring-2 focus:ring-brand"
              required
            />
          </div>

          <div className="form-control">
            <label className="label font-semibold text-gray-700 dark:text-gray-200">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              className="input input-bordered w-full bg-white dark:bg-gray-900 focus:ring-2 focus:ring-brand"
              required
            />
          </div>

          <div className="form-control">
            <label className="label font-semibold text-gray-700 dark:text-gray-200">
              Message
            </label>
            <textarea
              name="message"
              placeholder="Type your message here..."
              rows={5}
              value={formData.message}
              onChange={handleChange}
              className="textarea textarea-bordered w-full bg-white dark:bg-gray-900 focus:ring-2 focus:ring-brand"
              required
            ></textarea>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full mt-4 text-lg font-semibold tracking-wide shadow-md bg-brand text-white py-3 rounded-xl"
          >
            Send Message
          </motion.button>
        </motion.form>
      </div>
    </div>
  );
};

export default Contact;
