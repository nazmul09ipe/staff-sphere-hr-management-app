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

  // Office location
  const position = [23.750885, 90.391235];

  /* SUBMIT MESSAGE */
  const onSubmit = async (data) => {
    try {
      const res = await axiosSecure.post("/messages", data);

      if (res.data?.insertedId || res.data?.acknowledged) {
        toast.success("Message sent successfully!", {
          duration: 3000,
          style: {
            background: "#ff5376",
            color: "white",
            fontWeight: "500",
          },
        });

        reset();
      }
    } 
    catch (error) {
      console.log(error);
      toast.error("Failed to send message!");
    }
  };

  return (
    <div className="min-h-screen pt-28 mt-10 bg-linear-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 px-4 pb-12">
      <PageTitle title="Contact" />

      {/* HERO */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center pb-10"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          Get in Touch
        </h1>
        <p className="max-w-2xl mx-auto">
          Drop us a message and we’ll get back to you shortly.
        </p>
      </motion.div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* CONTACT INFO */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-8 space-y-6"
        >
          <h2 className="text-2xl font-semibold">Contact Information</h2>

          <div className="flex gap-4">
            <FaPhoneAlt className="text-xl" />
            <p>+880 1712-345678</p>
          </div>

          <div className="flex gap-4">
            <FaEnvelope className="text-xl" />
            <p>hello@ncgroup.com</p>
          </div>

          <div className="flex gap-4">
            <FaMapMarkerAlt className="text-xl" />
            <p>123 HR Avenue, Dhaka, Bangladesh</p>
          </div>

          {/* MAP */}
          <div className="w-full h-64 rounded-xl overflow-hidden">
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

        {/* FORM */}
        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 space-y-5"
        >
          <h2 className="text-2xl font-semibold mb-4">Send a Message</h2>

          <input
            {...register("name", { required: true })}
            placeholder="Your Name"
            className="input input-bordered w-full"
          />

          <input
            {...register("email", { required: true })}
            placeholder="Email Address"
            type="email"
            className="input input-bordered w-full"
          />

          <textarea
            {...register("message", { required: true })}
            rows="5"
            placeholder="Your Message"
            className="textarea textarea-bordered w-full"
          ></textarea>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full mt-4 text-lg font-semibold bg-blue-600 text-white py-3 rounded-xl"
          >
            Send Message
          </motion.button>
        </motion.form>
      </div>
    </div>
  );
};

export default Contact;
