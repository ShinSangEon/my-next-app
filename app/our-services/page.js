"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link"; // ✅ Next.js 전용 Link
import { motion } from "framer-motion";
import servicesData from "@/Locale/Services.json"; // ✅ 절대경로로 수정

const Services = () => {
  const [currentLanguage, setCurrentLanguage] = useState("ko");

  // ✅ 언어 변경 감지하여 상태 업데이트
  useEffect(() => {
    if (typeof window !== "undefined") {
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
      keys.reduce((obj, k) => obj?.[k], servicesData[currentLanguage]) || key
    );
  };

  // **애니메이션 효과**
  const fadeInVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: i * 0.2 },
    }),
  };

  const scaleUpVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } },
  };

  return (
    <motion.div
      className="container mx-auto px-4 sm:px-6 py-16 sm:py-24 max-w-7xl"
      initial="hidden"
      animate="visible"
    >
      {/* 제목 */}
      <motion.div
        className="text-center mb-12 sm:mb-16"
        variants={fadeInVariants}
        custom={0}
      >
        <motion.h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
          {getLocalizedText("services.mainTitle")}
        </motion.h1>
        <motion.p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
          {getLocalizedText("services.subTitle")}
        </motion.p>
      </motion.div>

      {/* 서비스 카드 */}
      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-16"
        initial="hidden"
        animate="visible"
      >
        {getLocalizedText("services.list").map((service, index) => (
          <motion.div
            key={index}
            className="bg-white p-6 sm:p-8 rounded-xl shadow-md hover:shadow-xl transition-transform duration-300 transform hover:-translate-y-2 group"
            variants={scaleUpVariants}
            custom={index}
          >
            <motion.div className="text-4xl sm:text-5xl mb-4 transition-transform group-hover:rotate-6">
              {service.icon}
            </motion.div>
            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
              {service.title}
            </h3>
            <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
              {service.description}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* 선택 이유 */}
      <motion.div
        className="text-center mb-16 sm:mb-24"
        variants={fadeInVariants}
        custom={1}
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-10 sm:mb-12">
          {getLocalizedText("services.whyUs.title")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-10">
          {getLocalizedText("services.whyUs.reasons").map((reason, index) => (
            <motion.div
              key={index}
              className="bg-gray-50 p-6 sm:p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
              variants={scaleUpVariants}
              custom={index}
            >
              <h4 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                {reason.title}
              </h4>
              <p className="text-sm sm:text-base text-gray-600">
                {reason.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 프로세스 */}
      <motion.div
        className="mb-20 sm:mb-24"
        variants={fadeInVariants}
        custom={2}
      >
        <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-10 sm:mb-12 text-center">
          {getLocalizedText("services.process.title")}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-10">
          {getLocalizedText("services.process.steps").map((step, index) => (
            <motion.div
              key={index}
              className="relative p-6 sm:p-8 bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300"
              variants={scaleUpVariants}
              custom={index}
            >
              <div className="text-blue-600 text-3xl sm:text-4xl font-bold mb-4">
                {step.step}
              </div>
              <h3 className="text-lg sm:text-xl font-semibold mb-2">
                {step.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        className="mt-20 sm:mt-32 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-10 sm:p-16 text-center text-white"
        variants={fadeInVariants}
        custom={3}
      >
        <h2 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
          {getLocalizedText("services.cta.title")}
        </h2>
        <p className="text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto">
          {getLocalizedText("services.cta.subtitle")}
        </p>
        <motion.div
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="inline-block"
        >
          <Link
            href="/contact"
            className="bg-white text-blue-600 px-8 sm:px-10 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-semibold hover:bg-blue-50 transition-colors duration-300"
          >
            {getLocalizedText("services.cta.button")}
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Services;
