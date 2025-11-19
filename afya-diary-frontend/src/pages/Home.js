import React, { useState } from "react";
import { Link } from "react-router-dom";
import FeaturesWithMockup from "./FeaturesWithMockup";
import "@fortawesome/fontawesome-free/css/all.min.css";
import ScrollAnimation from "../components/ScrollAnimation";
import { motion } from "framer-motion";
import { FaFacebookF, FaTwitter, FaLinkedinIn, FaInstagram } from "react-icons/fa";

export default function Home() {
  const FooterSection = ({ title, links }) => {
  const [open, setOpen] = useState(false);
  const [country, setCountry] = useState("Kenya");
  const [language, setLanguage] = useState("English");

  return (
    <div className="border-b border-gray-300 md:border-none pb-4 md:pb-0">

      {/* Header (clickable on mobile) */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between md:cursor-default md:pointer-events-none"
      >
        <h4 className="font-semibold text-gray-900">{title}</h4>
        <span className="md:hidden text-xl">{open ? "−" : "+"}</span>
      </button>

      {/* Content (accordion on mobile, open on desktop) */}
      <ul
        className={`overflow-hidden transition-all duration-300 md:block ${
          open ? "max-h-40 mt-3" : "max-h-0 md:max-h-full md:mt-3"
        }`}
      >
        {links.map((item) => (
          <li key={item.label} className="mt-2">
            <a href={item.href} className="hover:text-blue-700 text-gray-600">
              {item.label}
            </a>
          </li>
        ))}
      </ul>

    </div>
  );
};

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


     {/* Footer */}
<footer className="bg-gray-100 border-t border-gray-300 text-gray-700 text-sm">
  <div className="max-w-7xl mx-auto px-6 py-10">

    {/* Top Region Row */}
    <div className="flex flex-wrap items-center justify-between border-b border-gray-300 pb-6 mb-8">
      <div className="flex items-center gap-2">
        <span className="font-semibold">Country / Region:</span>
        <span className="text-gray-800 font-medium">Kenya</span>
      </div>

      <div className="flex items-center gap-2">
        <span className="font-semibold">Language:</span>
        <span className="text-gray-800 font-medium">English</span>
      </div>

      <div className="flex items-center gap-4">
        <span className="font-semibold">Contact us:</span>
        <span className="text-gray-800">+254 712 345 678</span>
        <span>•</span>
        <span className="text-gray-800">support@afyadiary.co.ke</span>
      </div>
    </div>

    {/* Link Sections */}
<div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6">

  <FooterSection
    title="Platform"
    links={[
      { label: "Features", href: "/features" },
      { label: "Mobile App", href: "/mobile-app" },
      { label: "Security", href: "/security" },
      { label: "Integrations", href: "/integrations" },
    ]}
  />

  <FooterSection
    title="Healthcare Tools"
    links={[
      { label: "Patient Records", href: "/patient-records" },
      { label: "Appointment System", href: "/appointments" },
      { label: "Analytics", href: "/analytics" },
      { label: "Doctor Dashboard", href: "/doctor-dashboard" },
    ]}
  />

  <FooterSection
    title="Documentation"
    links={[
      { label: "User Guides", href: "/guides" },
      { label: "API Documentation", href: "/api" },
      { label: "Help Center", href: "/faq" },
      { label: "Support", href: "/support" },
    ]}
  />

  <FooterSection
    title="Learn"
    links={[
      { label: "Health Guides", href: "/blogs" },
      { label: "Resources", href: "/resources" },
      { label: "Privacy & Safety", href: "/privacy-tips" },
      { label: "Training", href: "/training" },
    ]}
  />

  <FooterSection
    title="Company"
    links={[
      { label: "About Us", href: "/about" },
      { label: "Leadership", href: "/team" },
      { label: "Contact Us", href: "/contact" },
      { label: "Careers", href: "/careers" },
    ]}
  />

  <FooterSection
    title="Policies"
    links={[
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Data Protection", href: "/data-protection" },
      { label: "Complaints Procedure", href: "/complaints" },
    ]}
  />

</div>
    {/* Social Media Icons */}
    <div className="flex justify-center gap-6 my-8 text-lg text-gray-700">
      <a href="#" className="hover:text-blue-600"><FaFacebookF /></a>
      <a href="#" className="hover:text-blue-400"><FaTwitter /></a>
      <a href="#" className="hover:text-blue-700"><FaLinkedinIn /></a>
      <a href="#" className="hover:text-pink-500"><FaInstagram /></a>
    </div>


    {/* Legal Disclaimer */}
    <div className="mt-10 text-xs text-gray-500 leading-relaxed">
      <p>
        AfyaDiary Kenya is a digital healthcare management platform aimed at improving patient record
        accessibility, appointment management, and secure data handling. You should ensure that you use the
        system responsibly and comply with local healthcare regulations and data privacy laws.
      </p>

      <p className="mt-4">
        AfyaDiary Kenya Ltd is registered in Kenya. For any regulatory or compliance inquiries, please contact
        our support team.
      </p>
    </div>

    {/* Bottom Row */}
    <div className="flex flex-wrap items-center justify-between mt-8 pt-6 border-t border-gray-300">
      <p className="text-xs text-gray-500">
        © {new Date().getFullYear()} AfyaDiary Kenya. All rights reserved.
      </p>

      <div className="flex items-center gap-6 text-xs">
        <a href="/sitemap" className="hover:text-blue-700">Sitemap</a>
        <a href="/cookie-settings" className="hover:text-blue-700">Cookie Settings</a>
        <a href="/terms" className="hover:text-blue-700">Terms & Policies</a>
        <a href="/complaints" className="hover:text-blue-700">Complaints Procedure</a>
      </div>
    </div>
  </div>
</footer>



    </div>
  );
}
