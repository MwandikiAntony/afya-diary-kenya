import React, { useState } from "react";
import { Link } from "react-router-dom";

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
      className="px-5 py-2.5 bg-green-600 text-white font-semibold rounded-full shadow-md hover:bg-green-700 hover:shadow-lg transition-all duration-300"
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
        className="px-5 py-2 bg-green-600 text-white font-semibold rounded-full hover:bg-green-700 transition-all duration-300"
        onClick={() => setMenuOpen(false)}
      >
        Sign Up
      </Link>
    </div>
  )}
</nav>


      {/* ✅ Hero Section */}
      <header className="relative h-[95vh] flex items-center">
        {/* Background Image */}
        <img
          src="/images/Hero.png"
          alt="Trusted Medical Care for Every Kenyan"
          className="absolute inset-0 w-full h-full object-cover"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>

        {/* Hero Content */}
        <div className="relative z-10 text-left px-6 md:px-20 max-w-2xl text-white">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            Trusted Medical Care <br /> For Every Kenyan
          </h1>
          <p className="text-lg md:text-xl mb-10 text-gray-200 leading-relaxed">
            AfyaDiary Kenya — your trusted healthcare companion. Manage patients,
            track appointments, store records, and never miss important reminders.
          </p>
          <div className="flex gap-6 flex-wrap">
            <Link
              to="/login"
              className="px-8 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="px-8 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* ✅ Features Section */}
      <section className="px-6 md:px-16 py-20 bg-white shadow-inner">
        <h2 className="text-3xl md:text-4xl font-semibold text-center text-blue-800 mb-12">
          Why Choose AfyaDiary Kenya?
        </h2>
        <div className="grid gap-10 md:grid-cols-3 text-center">
          <div className="p-6 bg-blue-50 rounded-xl shadow hover:shadow-lg transition duration-200">
            <h3 className="text-xl md:text-2xl font-bold text-blue-700 mb-3">
              Patient Management
            </h3>
            <p className="text-gray-600">
              Easily register, monitor, and update patient records in one central place.
            </p>
          </div>
          <div className="p-6 bg-green-50 rounded-xl shadow hover:shadow-lg transition duration-200">
            <h3 className="text-xl md:text-2xl font-bold text-green-700 mb-3">
              Appointments & Reminders
            </h3>
            <p className="text-gray-600">
              Schedule and manage appointments with automatic reminders for better health outcomes.
            </p>
          </div>
          <div className="p-6 bg-blue-50 rounded-xl shadow hover:shadow-lg transition duration-200">
            <h3 className="text-xl md:text-2xl font-bold text-blue-700 mb-3">
              Secure Records
            </h3>
            <p className="text-gray-600">
              Keep sensitive medical information safe with encrypted record storage.
            </p>
          </div>
        </div>
      </section>

      {/* ✅ About Section */}
      <section className="px-6 md:px-16 py-20 bg-gradient-to-r from-blue-100 to-green-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-blue-800 mb-6">
            About AfyaDiary Kenya
          </h2>
          <p className="text-gray-700 text-lg md:text-xl leading-relaxed">
            AfyaDiary Kenya is a modern healthcare application built for hospitals, clinics, and patients. 
            Our mission is to simplify healthcare management and provide reliable, secure, and accessible 
            digital health services across Kenya and beyond.
          </p>
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
