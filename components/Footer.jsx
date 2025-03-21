"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";
import footerLocale from "@/Locale/Footer.json";

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

const Footer = () => {
  const [currentLanguage, setCurrentLanguage] = useState(
    (typeof window !== "undefined" && localStorage.getItem("language")) || "ko"
  );

  useEffect(() => {
    const handleLanguageChange = () => {
      setCurrentLanguage(localStorage.getItem("language") || "ko");
    };
    window.addEventListener("languageChange", handleLanguageChange);
    return () => {
      window.removeEventListener("languageChange", handleLanguageChange);
    };
  }, []);

  const getLocalizedText = (key) => {
    const keys = key.split(".");
    return (
      keys.reduce((obj, k) => obj?.[k], footerLocale[currentLanguage]) || key
    );
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* 회사 소개 */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              {getLocalizedText("footer.company.title")}
            </h3>
            <p className="text-gray-400">
              {getLocalizedText("footer.company.description")}
            </p>
          </div>

          {/* 빠른 링크 */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              {getLocalizedText("footer.quickLinks.title")}
            </h3>
            <ul className="space-y-2">
              {["", "about", "leadership", "board", "services", "contact"].map(
                (key) => (
                  <li key={key}>
                    <Link href={`/${key}`}>
                      <span
                        onClick={scrollToTop}
                        className="hover:text-white transition-colors cursor-pointer"
                      >
                        {getLocalizedText(`footer.quickLinks.${key || "home"}`)}
                      </span>
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* 연락처 */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              {getLocalizedText("footer.contact.title")}
            </h3>
            <ul className="space-y-2 text-gray-400">
              <li>{getLocalizedText("footer.contact.address1")}</li>
              <li>{getLocalizedText("footer.contact.address2")}</li>
              <li>{getLocalizedText("footer.contact.phone")}</li>
              <li>{getLocalizedText("footer.contact.email")}</li>
            </ul>
          </div>

          {/* 소셜 미디어 */}
          <div>
            <h3 className="text-xl font-bold mb-4">
              {getLocalizedText("footer.social.title")}
            </h3>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-white">
                <FaFacebook />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FaTwitter />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FaInstagram />
              </a>
              <a href="#" className="text-gray-400 hover:text-white">
                <FaLinkedin />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>{getLocalizedText("footer.copyright")}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
