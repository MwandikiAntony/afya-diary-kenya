import React from "react";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 via-white to-green-50">
      
      {/* Hero Section */}
      <header className="flex flex-col items-center justify-center py-28 px-6 text-center">
        <h1 className="text-5xl md:text-6xl font-extrabold text-blue-800">
          Afyadiary Kenya
        </h1>
        <p className="mt-6 text-lg md:text-xl text-gray-700 max-w-3xl leading-relaxed">
          Your trusted healthcare companion — manage patients, track appointments, store records, and never miss important health reminders.
        </p>
        <div className="mt-10 flex gap-6 flex-wrap justify-center">
          <Link
            to="/login"
            className="px-8 py-3 bg-blue-700 text-white rounded-lg shadow-md hover:bg-blue-800 transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="px-8 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition"
          >
            Create Account
          </Link>
        </div>
      </header>

      {/* Features Section */}
      <section className="px-6 md:px-16 py-20 bg-white shadow-inner">
        <h2 className="text-3xl md:text-4xl font-semibold text-center text-blue-800 mb-12">
          Why Choose Afyadiary Kenya?
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

      {/* About Section */}
      <section className="px-6 md:px-16 py-20 bg-gradient-to-r from-blue-100 to-green-100">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-semibold text-blue-800 mb-6">
            About Afyadiary Kenya
          </h2>
          <p className="text-gray-700 text-lg md:text-xl leading-relaxed">
            Afyadiary Kenya is a modern healthcare application built for hospitals, clinics, and patients. Our mission is to simplify healthcare management and provide reliable, secure, and accessible digital health services across Kenya and beyond.
          </p>
        </div>
      </section>

      {/* Call to Action */}
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

      {/* Footer */}
      <footer className="py-10 bg-gray-100 text-gray-600 text-sm text-center">
        <p>© {new Date().getFullYear()} Afyadiary Kenya. All rights reserved.</p>
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
