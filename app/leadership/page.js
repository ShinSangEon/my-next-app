"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import leadershipLocale from "@/Locale/Leadership.json";
import Human1 from "@/public/human.jpg"; // ✅ public 폴더 사용

const Leadership = () => {
  const [currentLanguage, setCurrentLanguage] = useState("ko");

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

  // 🔹 JSON 데이터에서 텍스트 가져오는 함수
  const getLocalizedText = (key) => {
    const keys = key.split(".");
    return (
      keys.reduce((obj, k) => obj?.[k], leadershipLocale[currentLanguage]) ||
      key
    );
  };

  const fadeInVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: i * 0.2 },
    }),
  };

  return (
    <motion.div
      className="container max-w-7xl mx-auto px-4 py-32"
      initial="hidden"
      animate="visible"
    >
      <motion.div className="text-center mb-12" variants={fadeInVariants}>
        <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
          {getLocalizedText("pageTitle")}
        </h1>
        <p className="text-xl text-gray-600">
          {getLocalizedText("pageSubtitle")}
        </p>
      </motion.div>

      {/* CEO 인사말 */}
      <motion.div
        className="flex flex-col md:flex-row gap-12 mb-24 items-center"
        variants={fadeInVariants}
      >
        <motion.div className="md:w-2/3" variants={fadeInVariants}>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            {getLocalizedText("ceoSection.title")}
          </h2>
          <div className="text-lg text-gray-600 space-y-6">
            <p>{getLocalizedText("ceoSection.greeting")}</p>
            <p>{getLocalizedText("ceoSection.message1")}</p>
            <p>{getLocalizedText("ceoSection.message2")}</p>
            <p>{getLocalizedText("ceoSection.message3")}</p>
            <p className="font-semibold mt-8">
              {getLocalizedText("ceoSection.signature")}
            </p>
          </div>
        </motion.div>
        <motion.div className="md:w-1/3" variants={fadeInVariants} custom={0.2}>
          <div className="rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300">
            <Image
              src={Human1}
              alt="CEO"
              className="w-full h-[400px] object-cover transform hover:scale-105 transition-transform duration-300"
              width={500}
              height={400}
              priority
            />
            <div className="p-4 bg-white text-center">
              <h3 className="text-xl font-bold text-gray-800">
                {getLocalizedText("ceoSection.name")}
              </h3>
              <p className="text-indigo-600">
                {getLocalizedText("ceoSection.position")}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* 경영진 섹션 */}
      <motion.div className="mb-24" variants={fadeInVariants} custom={0.4}>
        <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">
          {getLocalizedText("executivesSection.title")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {getLocalizedText("executivesSection.members").map(
            (executive, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                variants={fadeInVariants}
                custom={index}
              >
                <div className="aspect-square bg-gray-100 overflow-hidden">
                  <Image
                    src={Human1}
                    alt={executive.name}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                    width={400}
                    height={400}
                  />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">
                    {executive.name}
                  </h3>
                  <p className="text-indigo-600 font-semibold mb-4">
                    {executive.position}
                  </p>
                  <p className="text-gray-600">{executive.description}</p>
                </div>
              </motion.div>
            )
          )}
        </div>
      </motion.div>

      {/* 팀원 섹션 */}
      <motion.div className="mb-24" variants={fadeInVariants} custom={0.6}>
        <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
          {getLocalizedText("teamSection.title")}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {getLocalizedText("teamSection.members").map((teamMember, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300"
              variants={fadeInVariants}
              custom={index}
            >
              <div className="aspect-square bg-gray-200 overflow-hidden">
                <Image
                  src={Human1}
                  alt={teamMember.name}
                  className="w-full h-full object-cover"
                  width={400}
                  height={400}
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  {teamMember.name}
                </h3>
                <p className="text-indigo-600 font-semibold mb-4">
                  {teamMember.position}
                </p>
                <p className="text-gray-600">{teamMember.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Leadership;
