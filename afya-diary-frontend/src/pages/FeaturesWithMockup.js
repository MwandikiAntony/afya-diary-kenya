import React from "react";
import { UserCheck, CalendarCheck, Lock } from "lucide-react";
import FeatureCard from "../components/FeatureCard";
import { motion } from "framer-motion";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.25, // delay between child animations
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

export default function FeaturesWithMockup() {
  return (
    <motion.section
      aria-labelledby="features-title"
      className="px-6 md:px-16 py-24 bg-gradient-to-br from-blue-50 via-white to-green-50 overflow-hidden"
      variants={containerVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* Section Title */}
      <motion.h2
        id="features-title"
        className="text-4xl md:text-5xl font-bold text-center text-blue-800 mb-12"
        variants={itemVariants}
      >
        Smarter Healthcare. Simple. Secure.
      </motion.h2>

      {/* Grid Layout */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        {/* Left Side: Features */}
        <motion.div className="grid gap-8" variants={containerVariants}>
          <motion.div variants={itemVariants}>
            <FeatureCard Icon={UserCheck} title="Patient Management">
              Register, monitor, and manage patient records seamlessly — ensuring
              efficient, accurate, and connected healthcare delivery.
            </FeatureCard>
          </motion.div>

          <motion.div variants={itemVariants}>
            <FeatureCard Icon={CalendarCheck} title="Appointments & Reminders">
              Automate patient scheduling and send smart reminders to reduce missed
              visits and boost engagement across clinics.
            </FeatureCard>
          </motion.div>

          <motion.div variants={itemVariants}>
            <FeatureCard Icon={Lock} title="Data Security & Privacy">
              Your patients’ records are protected with end-to-end encryption and
              role-based access for full data privacy compliance.
            </FeatureCard>
          </motion.div>
        </motion.div>

        {/* Right Side: Mobile Mockup */}
        <motion.div
          className="relative flex justify-center md:justify-end"
          variants={itemVariants}
        >
          <img
            src="/images/Mobile.png"
            alt="AfyaDiary Kenya mobile app"
            className="relative w-64 md:w-80 lg:w-96 drop-shadow-2xl transform md:-translate-y-10 hover:scale-105 transition-transform duration-500 ease-out"
          />
        </motion.div>
      </div>

      {/* CTA */}
      <motion.div
        className="text-center mt-16"
        variants={itemVariants}
      >
        <a
          href="/features"
          className="inline-block px-8 py-3 bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:bg-blue-800 hover:scale-105 transition-all duration-300"
        >
          Explore Full Features
        </a>
      </motion.div>
    </motion.section>
  );
}
