import React from "react";

export function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-white shadow-md rounded-2xl border border-gray-200 p-4 ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }) {
  return <div className={`mb-2 ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = "" }) {
  return (
    <h2 className={`text-xl font-semibold text-gray-800 mb-2 ${className}`}>
      {children}
    </h2>
  );
}

export function CardContent({ children, className = "" }) {
  return <div className={`mt-2 ${className}`}>{children}</div>;
}
