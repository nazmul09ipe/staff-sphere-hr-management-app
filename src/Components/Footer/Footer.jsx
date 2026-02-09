import { FaFacebookF, FaLinkedinIn, FaInstagram, FaEnvelope, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* Logo + Slogan */}
        <div>
          <h2 className="text-2xl font-bold text-white">NC Group</h2>
          <p className="mt-2 text-sm text-gray-400">
            "Crafting Quality with Commitment"
          </p>
          <p className="mt-4 text-gray-500 text-sm leading-relaxed">
            A trusted garment manufacturing partner delivering excellence, innovation,
            and on-time global apparel solutions.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-white transition">
              <a href="/">Home</a>
            </li>
            <li className="hover:text-white transition">
              <a href="/products">Our Products</a>
            </li>
            <li className="hover:text-white transition">
              <a href="/buyers">Our Buyers</a>
            </li>
            <li className="hover:text-white transition">
              <a href="/contact">Contact Us</a>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-3">Contact</h3>
          <ul className="space-y-3 text-sm">
            <li className="flex items-center gap-3">
              <FaMapMarkerAlt className="text-primary text-lg" />
              <span>Tejgaon, Dhaka, Bangladesh</span>
            </li>
            <li className="flex items-center gap-3">
              <FaPhoneAlt className="text-primary text-lg" />
              <span>+880 1712-345678</span>
            </li>
            <li className="flex items-center gap-3">
              <FaEnvelope className="text-primary text-lg" />
              <span>info@ncgroup.com</span>
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-3">Follow Us</h3>
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="w-10 h-10 flex items-center justify-center bg-gray-800 rounded-full hover:bg-primary transition"
            >
              <FaFacebookF className="text-white text-lg" />
            </a>
            <a
              href="#"
              className="w-10 h-10 flex items-center justify-center bg-gray-800 rounded-full hover:bg-primary transition"
            >
              <FaLinkedinIn className="text-white text-lg" />
            </a>
            <a
              href="#"
              className="w-10 h-10 flex items-center justify-center bg-gray-800 rounded-full hover:bg-primary transition"
            >
              <FaInstagram className="text-white text-lg" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="border-t border-gray-700 mt-10 pt-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} <span className="text-white font-semibold">NC Group</span>. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
