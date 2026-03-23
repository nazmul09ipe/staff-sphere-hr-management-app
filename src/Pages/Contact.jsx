import { motion } from "framer-motion";
import { FaPhoneAlt, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";
import toast from "react-hot-toast";
import PageTitle from "../Shared/PageTitle";
import { useForm } from "react-hook-form";

import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import useAxiosSecure from "../Hooks/useAxiosSecure";

const Contact = () => {
  const { register, handleSubmit, reset } = useForm();
  const axiosSecure = useAxiosSecure();

  const position = [23.750885, 90.391235];

  const onSubmit = async (data) => {
    try {
      const res = await axiosSecure.post("/messages", data);
      if (res.data?.insertedId || res.data?.acknowledged) {
        toast.success("Message sent successfully!", {
          duration: 3000,
          style: {
            background: "#4f46e5",
            color: "white",
            fontWeight: "500",
          },
        });
        reset();
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to send message!");
    }
  };

  return (
    <div className="min-h-screen pt-28 mt-10 bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 pb-12">
      <PageTitle title="Contact" />

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center pb-10"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-3 text-gray-800 dark:text-gray-100">
          Get in Touch
        </h1>
        <p className="max-w-2xl mx-auto text-gray-600 dark:text-gray-300">
          Drop us a message and we’ll get back to you shortly.
        </p>
      </motion.div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Contact Info */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 space-y-6 border border-gray-200 dark:border-gray-700"
        >
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Contact Information
          </h2>

          <div className="flex gap-4 items-center text-gray-700 dark:text-gray-300">
            <FaPhoneAlt className="text-xl text-blue-600" />
            <p>+880 1712-345678</p>
          </div>

          <div className="flex gap-4 items-center text-gray-700 dark:text-gray-300">
            <FaEnvelope className="text-xl text-green-600" />
            <p>hello@ncgroup.com</p>
          </div>

          <div className="flex gap-4 items-center text-gray-700 dark:text-gray-300">
            <FaMapMarkerAlt className="text-xl text-red-600" />
            <p>123 HR Avenue, Dhaka, Bangladesh</p>
          </div>

          {/* Map */}
          <div className="w-full h-64 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
            <MapContainer
              center={position}
              zoom={14}
              scrollWheelZoom={false}
              className="h-full w-full"
            >
              <TileLayer
                attribution='&copy; OpenStreetMap contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <Marker position={position}>
                <Popup>
                  NC Group Office <br /> Dhaka, Bangladesh
                </Popup>
              </Marker>
            </MapContainer>
          </div>
        </motion.div>

        {/* Contact Form */}
        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 space-y-5 border border-gray-200 dark:border-gray-700"
        >
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
            Send a Message
          </h2>

          <input
            {...register("name", { required: true })}
            placeholder="Your Name"
            className="input input-bordered w-full border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
          />

          <input
            {...register("email", { required: true })}
            placeholder="Email Address"
            type="email"
            className="input input-bordered w-full border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
          />

          <textarea
            {...register("message", { required: true })}
            rows="5"
            placeholder="Your Message"
            className="textarea textarea-bordered w-full border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-800 dark:text-gray-100"
          ></textarea>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full mt-4 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-purple-600 hover:to-blue-600 text-white py-3 rounded-xl shadow-lg transition-all duration-300"
          >
            Send Message
          </motion.button>
        </motion.form>
      </div>
    </div>
  );
};

export default Contact;