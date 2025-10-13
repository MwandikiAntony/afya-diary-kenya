import React from "react";

export function Button({
  children,
  type = "button",
  variant = "default",
  disabled = false,
  className = "",
  ...props
}) {
  const base =
    "px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 focus:outline-none";
  const variants = {
    default:
      "bg-blue-600 hover:bg-blue-700 text-white shadow-sm disabled:opacity-50",
    secondary:
      "bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300",
    outline:
      "border border-gray-300 text-gray-700 hover:bg-gray-100",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
