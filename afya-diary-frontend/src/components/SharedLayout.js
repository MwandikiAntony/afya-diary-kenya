import React from "react";

export default function SharedLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Optional: shared navbar/header */}
      <header className="bg-white shadow p-4 text-xl font-bold">
        Afya Diary
      </header>

      <main className="p-6">{children}</main>

      {/* Optional: shared footer */}
      <footer className="text-center text-sm text-gray-500 py-4">
        © {new Date().getFullYear()} Afya Diary. All rights reserved.
      </footer>
    </div>
  );
}
