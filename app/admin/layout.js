// app/admin/layout.jsx
import AdminNavbar from "@/components/AdminNavbar"; // 경로 맞춰주기
import React from "react";

export default function AdminLayout({ children }) {
  return (
    <>
      <AdminNavbar />
      <main className="min-h-screen bg-gray-50 p-4">{children}</main>
    </>
  );
}
