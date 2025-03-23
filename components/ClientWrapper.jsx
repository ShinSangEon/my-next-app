"use client";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { usePathname } from "next/navigation";

export default function ClientWrapper({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      {!isAdmin && <Navbar />}
      {children}
      {!isAdmin && <Footer />}
    </>
  );
}
