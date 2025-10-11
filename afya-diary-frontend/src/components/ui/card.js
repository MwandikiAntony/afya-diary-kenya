import * as React from "react";

export function Card({ className = "", children }) {
  return (
    <div className={`bg-white rounded-xl shadow p-4 ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ children }) {
  return <div className="mb-2 font-semibold">{children}</div>;
}

export function CardContent({ children }) {
  return <div>{children}</div>;
}
