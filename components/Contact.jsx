"use client"; // 👉 Next.js Client Component 선언 (localStorage 사용 시 필수!)

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import contactLocale from "@/Locale/Contact-Components.json"; // 경로 조정 (Next.js에서 @ 사용 가능)

const Contact = () => {
  const [currentLanguage, setCurrentLanguage] = useState("ko");

  useEffect(() => {
    if (typeof window !== "undefined") {
      // localStorage 접근은 반드시 클라이언트에서
      const lang = localStorage.getItem("language") || "ko";
      setCurrentLanguage(lang);

      const handleLanguageChange = () => {
        setCurrentLanguage(localStorage.getItem("language") || "ko");
      };
      window.addEventListener("languageChange", handleLanguageChange);
      return () => {
        window.removeEventListener("languageChange", handleLanguageChange);
      };
    }
  }, []);

  const getLocalizedText = (key) => {
    const keys = key.split(".");
    return (
      keys.reduce((obj, k) => obj?.[k], contactLocale[currentLanguage]) || key
    );
  };

  const gridVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: i * 0.2 },
    }),
  };

  const titleVariant = {
    hidden: { opacity: 0, y: -50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  };

  const mapVariant = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 1, delay: 0.5 } },
  };

  const buttonVariant = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.8 } },
  };

  return (
    <motion.div
      className="bg-white py-20 lg:py-40"
      initial="hidden"
      animate="visible"
    >
      <div className="container mx-auto px-6 max-w-6xl">
        <motion.div className="text-center mb-12" variants={titleVariant}>
          <motion.h2
            className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4"
            variants={titleVariant}
          >
            {getLocalizedText("contact.title")}
          </motion.h2>
          <motion.p className="text-gray-600 text-lg" variants={titleVariant}>
            {getLocalizedText("contact.subtitle")}
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {Object.keys(getLocalizedText("contact.contactMethods")).map(
            (key, index) => {
              const method = getLocalizedText(`contact.contactMethods.${key}`);
              return (
                <motion.div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow hover:shadow-md transition-shadow duration-300 text-center"
                  custom={index}
                  initial="hidden"
                  animate="visible"
                  variants={gridVariants}
                >
                  <div className="text-3xl mb-3">{method.icon}</div>
                  <h3 className="text-xl font-bold mb-2">{method.title}</h3>
                  <p className="text-gray-600">{method.info}</p>
                  <p className="text-gray-500 text-sm">{method.subInfo}</p>
                </motion.div>
              );
            }
          )}
        </div>

        <motion.div
          className="mb-12 max-w-4xl mx-auto"
          variants={mapVariant}
          initial="hidden"
          animate="visible"
        >
          <div className="bg-white shadow-lg rounded-xl overflow-hidden">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3261.766221083579!2d128.1143747771263!3d35.16245065829543!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x356efc9d5bf27607%3A0xe3115b0fabe83ba3!2z6rK97IOB64Ko64-EIOynhOyjvOyLnCDtmLjtg4Trj5kgNjI0LTE5!5e0!3m2!1sko!2skr!4v1739346064238!5m2!1sko!2skr"
              width="100%"
              height="400"
              loading="lazy"
              className="w-full h-[400px] md:h-[600px] lg:h-[600px]"
            ></iframe>
          </div>
        </motion.div>

        <motion.div
          className="mt-12 text-center"
          variants={buttonVariant}
          initial="hidden"
          animate="visible"
        >
          <Link
            href="/contact"
            className="inline-block px-10 py-3 text-lg font-medium text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700 transition-all duration-300 ease-in-out hover:shadow-lg"
          >
            {getLocalizedText("contact.button")}
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Contact;
