import React, { useState } from "react";
import { Link } from "react-router-dom";
import FeaturesWithMockup from "./FeaturesWithMockup";
export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);



  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-green-50">
      
      {/* ✅ Transparent Navbar over hero */}
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


      {/* ✅ Hero Section */}
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
    <h1 className="text-5xl md:text-4xl font-bold mb-5 leading-tight tracking-tight drop-shadow-lg">
      Trusted Medical Care <br />For Every Kenyan
    </h1>
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



      {/* ✅ Features Section */}
      <FeaturesWithMockup/>
     


      {/* ✅ About Section */}
      {/* ✅ About Section */}
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


      {/* ✅ Call to Action */}
      <section className="py-20 bg-blue-700 text-center text-white">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Ready to take charge of your health?
        </h2>
        <p className="mb-6 text-lg md:text-xl">
          Create your account today and experience simplified healthcare management.
        </p>
        <Link
          to="/register"
          className="px-8 py-3 bg-green-500 text-white rounded-lg shadow-md hover:bg-green-600 transition"
        >
          Get Started
        </Link>
      </section>

      {/* ✅ Footer */}
      <footer className="py-10 bg-gray-100 text-gray-600 text-sm text-center">
        <p>© {new Date().getFullYear()} AfyaDiary Kenya. All rights reserved.</p>
        <div className="mt-4 flex flex-wrap justify-center gap-6 text-gray-500">
          <a href="/privacy" className="hover:text-blue-700 transition">Privacy Policy</a>
          <a href="/terms" className="hover:text-blue-700 transition">Terms of Service</a>
          <a href="/contact" className="hover:text-blue-700 transition">Contact</a>
          <a href="/support" className="hover:text-blue-700 transition">Support</a>
        </div>
      </footer>
    </div>
  );
}
