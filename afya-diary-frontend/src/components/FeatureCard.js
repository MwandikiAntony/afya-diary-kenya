import React from "react";

export default function FeatureCard({ Icon, title, children }) {
  return (
    <div className="p-6 md:p-8 bg-white rounded-2xl border border-blue-100 shadow-sm hover:shadow-lg hover:border-green-200 transition-all duration-300 transform hover:-translate-y-1">
      {Icon && <Icon className="w-8 h-8 text-green-600 mb-4" />}
      <h3 className="text-xl font-semibold mb-2 text-blue-800">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{children}</p>
    </div>
  );
}
