import React from "react";
import { UserCheck, CalendarCheck, Lock } from "lucide-react";
import FeatureCard from "../components/FeatureCard";

export default function FeaturesWithMockup() {
  return (
    <section
      aria-labelledby="features-title"
      className="px-6 md:px-16 py-24 bg-gradient-to-br from-blue-50 via-white to-green-50"
    >
      {/* Section Title */}
      <h2
        id="features-title"
        className="text-4xl md:text-5xl font-bold text-center text-blue-800 mb-12"
      >
        Smarter Healthcare. Simple. Secure.
      </h2>

      {/* Grid Layout */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 items-center">
        {/* Left Side: Features */}
        <div className="grid gap-8">
          <FeatureCard Icon={UserCheck} title="Patient Management">
            Register, monitor, and manage patient records seamlessly — ensuring
            efficient, accurate, and connected healthcare delivery.
          </FeatureCard>

          <FeatureCard Icon={CalendarCheck} title="Appointments & Reminders">
            Automate patient scheduling and send smart reminders to reduce missed
            visits and boost engagement across clinics.
          </FeatureCard>

          <FeatureCard Icon={Lock} title="Data Security & Privacy">
            Your patients’ records are protected with end-to-end encryption and
            role-based access for full data privacy compliance.
          </FeatureCard>
        </div>

        {/* Right Side: Mobile Mockup */}
        <div className="relative flex justify-center md:justify-end">
  {/* Remove the gradient and use subtle shadow only */}
  <img
    src="/images/MobileMockup.png"
    alt="AfyaDiary Kenya mobile app"
    className="relative w-64 md:w-80 lg:w-96 drop-shadow-2xl transform md:-translate-y-10 hover:scale-105 transition-transform duration-500 ease-out"
  />
</div>

      </div>

      {/* CTA */}
      <div className="text-center mt-16">
        <a
          href="/features"
          className="inline-block px-8 py-3 bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:bg-blue-800 hover:scale-105 transition-all duration-300"
        >
          Explore Full Features
        </a>
      </div>
    </section>
  );
}
