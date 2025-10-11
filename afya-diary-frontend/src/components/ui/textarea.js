import React from "react";

export function Textarea({ className = "", ...props }) {
  return (
    <textarea
      className={`border rounded-lg w-full p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      {...props}
    />
  );
}
