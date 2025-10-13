import React from "react";

export function Input({
  type = "text",
  className = "",
  ...props
}) {
  return (
    <input
      type={type}
      className={`w-full border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all ${className}`}
      {...props}
    />
  );
}
