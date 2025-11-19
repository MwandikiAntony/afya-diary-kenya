import React, { useState } from "react";
import { Link } from "react-router-dom";
import FeaturesWithMockup from "./FeaturesWithMockup";
import "@fortawesome/fontawesome-free/css/all.min.css";
import ScrollAnimation from "../components/ScrollAnimation";
import { motion } from "framer-motion";

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);



  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-green-50">
      
      {/*  Transparent Navbar over hero */}
      <nav className="fixed top-0 left-0 w-full flex items-center justify-between px-6 md:px-12 py-4 bg-white shadow-md z-50">
  {/* Logo */}
  <h1 className="text-2xl font-bold text-blue-800 tracking-tight">
    AfyaDiary <span className="text-green-600">Kenya</span>
  </h1>

  {/* Desktop Links */}
  <div className="hidden md:flex items-center gap-6 font-medium">
    <Link
      to="/"
      className="text-gray-700 hover:text-green-600 transition-colors duration-200"
    >
      Home
    </Link>
    <Link
      to="/login"
      className="text-gray-700 hover:text-green-600 transition-colors duration-200"
    >
      Login
    </Link>
    <Link
  to="/register"
  className="text-gray-700 hover:text-green-600 transition-colors duration-200"
>
  Sign Up
</Link>

  </div>

  {/* Mobile Menu Button */}
  <button
    onClick={() => setMenuOpen(!menuOpen)}
    className="md:hidden text-gray-800 focus:outline-none"
  >
    {menuOpen ? (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    ) : (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6h16M4 12h16M4 18h16"
        />
      </svg>
    )}
  </button>

  {/* Mobile Dropdown Menu */}
  {menuOpen && (
    <div className="absolute top-16 left-0 w-full bg-white text-gray-800 shadow-lg flex flex-col items-center gap-4 py-6 md:hidden">
      <Link
        to="/"
        className="hover:text-green-600 transition-colors duration-200"
        onClick={() => setMenuOpen(false)}
      >
        Home
      </Link>
      <Link
        to="/login"
        className="hover:text-green-600 transition-colors duration-200"
        onClick={() => setMenuOpen(false)}
      >
        Login
      </Link>
      <Link
        to="/register"
        className="hover:text-green-600 transition-colors duration-200"
        onClick={() => setMenuOpen(false)}
      >
        Sign Up
      </Link>
    </div>
  )}
</nav>


      {/*  Hero Section */}
      <header className="relative h-[95vh] flex items-center overflow-hidden">
  {/* Background Image */}
  <img
    src="/images/Hero.png"
    alt="Trusted Medical Care for Every Kenyan"
    className="absolute inset-0 w-full h-full object-cover scale-105"
  />

  {/* Gradient Overlay */}
  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-transparent"></div>

  {/* Hero Content */}
  <div className="relative z-10 text-left px-6 md:px-24 max-w-xl text-white">
   <motion.h1
  initial={{ opacity: 0, y: -50 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 1 }}
  className="text-4xl md:text-4xl font-bold mb-5 tracking-tight drop-shadow-md"
>
  Trusted Medical Care <br /> For Every Kenyan.
</motion.h1>

    <p className="text-lg md:text-xl mb-10 text-gray-200 leading-relaxed">
      Manage patients, track appointments, store records, and never miss important reminders.
    </p>
    <div className="flex gap-6">
      <Link
        to="/login"
        className="px-8 py-3 bg-blue-700 text-white rounded-lg font-medium shadow-md hover:bg-blue-800 hover:scale-105 transition-all duration-300"
      >
        Login
      </Link>
      <Link
        to="/register"
        className="px-8 py-3 bg-green-600 text-white rounded-lg font-medium shadow-md hover:bg-green-700 hover:scale-105 transition-all duration-300"
      >
        Sign Up
      </Link>
    </div>
  </div>
</header>
{/* Mental Health*/}
<section className="bg-blue-50 py-12 text-center">
  <h2 className="text-3xl font-semibold text-blue-700 mb-4">
    Feeling stressed or overwhelmed?
  </h2>
  <p className="text-gray-600 mb-6">
    Get mental health support and talk with our AI Wellness Assistant for free.
  </p>
  <div className="flex justify-center gap-4">
    <a href="/register" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
      Get Help Now
    </a>
    <a href="/learn-more" className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50">
      Learn More
    </a>
  </div>
</section>




      {/*  Features Section */}
      <FeaturesWithMockup/>
     


      {/*  About Section */}
     
<ScrollAnimation>
  <section className="relative px-6 md:px-16 py-24 bg-white">
  <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
    {/* Left: Image */}
    <div className="relative">
      <div className="absolute inset-0 bg-blue-100 rounded-3xl blur-3xl opacity-40"></div>
      <img
        src="/images/about-healthcare-team.png"
        alt="Healthcare professionals collaborating"
        className="relative rounded-2xl shadow-2xl w-full h-auto object-cover"
      />
    </div>

    {/* Right: Text Content */}
    <div>
      <h2 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6 leading-snug">
        About <span className="text-green-600">AfyaDiary Kenya</span>
      </h2>

      <p className="text-gray-600 text-lg md:text-xl leading-relaxed mb-6">
        AfyaDiary Kenya is a modern healthcare management platform designed to
        connect patients, chemists, hospitals, and community health volunteers.
        Our goal is to make healthcare data simple, secure, and accessible for
        everyone — empowering digital health across Kenya and beyond.
      </p>

      <div className="grid sm:grid-cols-2 gap-6 mt-8">
        <div className="flex items-start gap-4">
          <div className="bg-green-100 text-green-700 p-3 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 16h-1v-4h-1m1-4h.01M12 20.5a8.5 8.5 0 100-17 8.5 8.5 0 000 17z"
              />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold text-lg text-blue-800">Our Mission</h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              To improve healthcare accessibility and transparency through
              secure digital innovation.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="bg-blue-100 text-blue-700 p-3 rounded-lg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div>
            <h4 className="font-semibold text-lg text-blue-800">Our Vision</h4>
            <p className="text-gray-600 text-sm leading-relaxed">
              A connected Kenya where every citizen can access efficient,
              reliable, and digital health services.
            </p>
          </div>
        </div>
      </div>

      <a
        href="/about"
        className="inline-block mt-10 px-8 py-3 bg-blue-700 text-white font-medium rounded-lg shadow-md hover:bg-blue-800 hover:scale-105 transition-transform duration-300"
      >
        Learn More
      </a>
    </div>
  </div>
</section>
</ScrollAnimation>


   
  {/*  Call-to-Action Section */}
<ScrollAnimation>
  <section className="relative py-24 overflow-hidden bg-gradient-to-r from-blue-800 via-blue-700 to-green-600 text-white text-center">
  {/* Decorative gradient glow */}
  <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.2),transparent_60%)]"></div>

  <div className="relative max-w-3xl mx-auto px-6">
    <motion.h2
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.7 }}
  viewport={{ once: true }}
  className="text-4xl md:text-5xl font-bold mb-6 tracking-tight drop-shadow-md"
>
  Ready to Take Charge of Your Health?
</motion.h2>
    <p className="text-lg md:text-xl text-blue-100 mb-10 leading-relaxed">
      Join thousands of Kenyans using <span className="font-semibold text-green-300">AfyaDiary Kenya </span> 
       to manage their health records, appointments, and wellness journey all in one place.
    </p>

    <Link
      to="/register"
      className="inline-block px-10 py-4 bg-green-500 text-white font-semibold rounded-full shadow-lg hover:bg-green-400 hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-out"
    >
      Get Started
    </Link>

  </div>
</section>
</ScrollAnimation>


      {/*  Footer */}
      <footer className="py-10 bg-gray-100 text-gray-600 text-sm text-center border-t border-gray-200">
  {/* Brand */}
   <h2 className="text-2xl font-bold text-blue-800 tracking-tight">
    AfyaDiary <span className="text-green-600">Kenya</span>
  </h2>
  <p className="text-gray-500 mb-6">
    Empowering healthcare through digital innovation and secure access.
  </p>

  {/* Links */}
  <div className="flex flex-wrap justify-center gap-6 mb-6 text-gray-500">
    <a
      href="/privacy"
      className="flex items-center gap-2 hover:text-blue-700 transition-all duration-300 hover:scale-105"
    >
      <i className="fas fa-user-shield"></i> Privacy Policy
    </a>
    <a
      href="/terms"
      className="flex items-center gap-2 hover:text-blue-700 transition-all duration-300 hover:scale-105"
    >
      <i className="fas fa-file-contract"></i> Terms of Service
    </a>
    <a
      href="/contact"
      className="flex items-center gap-2 hover:text-blue-700 transition-all duration-300 hover:scale-105"
    >
      <i className="fas fa-envelope"></i> Contact
    </a>
    <a
      href="/support"
      className="flex items-center gap-2 hover:text-blue-700 transition-all duration-300 hover:scale-105"
    >
      <i className="fas fa-headset"></i> Support
    </a>
  </div>

  {/* Social Media Icons */}
  <div className="flex justify-center gap-6 mb-6 text-gray-500">
    <a
      href="https://facebook.com"
      target="_blank"
      rel="noopener noreferrer"
      className="p-3 bg-gray-200 rounded-full hover:bg-blue-700 hover:text-white transition-all duration-300 transform hover:scale-110"
    >
      <i className="fab fa-facebook-f text-lg"></i>
    </a>
    <a
      href="https://twitter.com"
      target="_blank"
      rel="noopener noreferrer"
      className="p-3 bg-gray-200 rounded-full hover:bg-blue-700 hover:text-white transition-all duration-300 transform hover:scale-110"
    >
      <i className="fab fa-twitter text-lg"></i>
    </a>
    <a
      href="https://linkedin.com"
      target="_blank"
      rel="noopener noreferrer"
      className="p-3 bg-gray-200 rounded-full hover:bg-blue-700 hover:text-white transition-all duration-300 transform hover:scale-110"
    >
      <i className="fab fa-linkedin-in text-lg"></i>
    </a>
    <a
      href="https://instagram.com"
      target="_blank"
      rel="noopener noreferrer"
      className="p-3 bg-gray-200 rounded-full hover:bg-blue-700 hover:text-white transition-all duration-300 transform hover:scale-110"
    >
      <i className="fab fa-instagram text-lg"></i>
    </a>
  </div>

  {/* Copyright */}
  <p className="text-gray-500 text-xs">
    © {new Date().getFullYear()} <span className="font-medium">AfyaDiary Kenya</span>. All rights reserved.
  </p>
</footer>


    </div>
  );
}
