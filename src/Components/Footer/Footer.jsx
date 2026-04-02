import {
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaArrowUp,
} from "react-icons/fa";
import { Link as ScrollLink } from "react-scroll"; // Smooth scroll

const Footer = () => {
  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer className="bg-gradient-to-t from-gray-900 via-gray-950 to-gray-900 text-gray-300 pt-14 pb-8 relative">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {/* Logo + Slogan */}
        <div>
          <h2 className="text-2xl font-bold text-white">NC Group</h2>
          <p className="mt-2 text-sm text-gray-400 italic">
            "Crafting Quality with Commitment"
          </p>
          <p className="mt-4 text-gray-400 text-sm leading-relaxed">
            A trusted garment manufacturing partner delivering excellence,
            innovation, and on-time global apparel solutions.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-xl font-semibold text-white mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li className="hover:text-primary transition-colors duration-300">
              <a href="/">Home</a>
            </li>
            <li className="hover:text-primary transition-colors duration-300">
              <ScrollLink
                to="our-products"
                smooth={true}
                offset={-80}
                duration={600}
                className="cursor-pointer"
              >
                Our Products
              </ScrollLink>
            </li>
            <li className="hover:text-primary transition-colors duration-300">
              <ScrollLink
                to="our-buyers"
                smooth={true}
                offset={-80}
                duration={600}
                className="cursor-pointer"
              >
                Our Buyers
              </ScrollLink>
            </li>
            <li className="hover:text-primary transition-colors duration-300 mouse-pointer">
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
              className="w-10 h-10 flex items-center justify-center bg-gray-800 rounded-full hover:bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg transition-all duration-300"
            >
              <FaFacebookF className="text-white text-lg" />
            </a>
            <a
              href="#"
              className="w-10 h-10 flex items-center justify-center bg-gray-800 rounded-full hover:bg-gradient-to-r from-blue-400 to-blue-700 shadow-lg transition-all duration-300"
            >
              <FaLinkedinIn className="text-white text-lg" />
            </a>
            <a
              href="#"
              className="w-10 h-10 flex items-center justify-center bg-gray-800 rounded-full hover:bg-gradient-to-r from-pink-500 to-orange-500 shadow-lg transition-all duration-300"
            >
              <FaInstagram className="text-white text-lg" />
            </a>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <button
        onClick={scrollToTop}
        className="absolute right-6 bottom-6 w-12 h-12 flex items-center justify-center bg-primary rounded-full hover:bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg transition-all duration-300"
        aria-label="Scroll to top"
      >
        <FaArrowUp className="text-white text-lg" />
      </button>

      {/* Bottom Line */}
      <div className="border-t border-gray-700 mt-10 pt-4 text-center text-sm text-gray-400">
        © {new Date().getFullYear()}{" "}
        <span className="text-white font-semibold">NC Group</span>. All Rights
        Reserved.
      </div>
    </footer>
  );
};

export default Footer;