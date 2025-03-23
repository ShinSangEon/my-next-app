"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { FiPhone, FiMail, FiMapPin } from "react-icons/fi";
import Swal from "sweetalert2";
import contactData from "@/Locale/Contact.json"; // ✅ 절대경로 수정

const fadeInVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.2 },
  }),
};

const buttonVariants = {
  hover: { scale: 1.05, transition: { duration: 0.3 } },
  tap: { scale: 0.95 },
};

const Contact = () => {
  const [language, setLanguage] = useState("ko");
  const [localizedData, setLocalizedData] = useState(contactData["ko"]);
  const [forceRender, setForceRender] = useState(0); // 리렌더링 트리거

  useEffect(() => {
    if (typeof window !== "undefined") {
      const lang = localStorage.getItem("language") || "ko";
      setLanguage(lang);
      setLocalizedData(contactData[lang]);

      const handleLanguageChange = () => {
        const newLang = localStorage.getItem("language") || "ko";
        setLanguage(newLang);
        setLocalizedData(contactData[newLang]);
        setForceRender((prev) => prev + 1);
      };

      window.addEventListener("languageChange", handleLanguageChange);
      return () => {
        window.removeEventListener("languageChange", handleLanguageChange);
      };
    }
  }, []);

  const getLocalizedText = (key) => {
    const keys = key.split(".");
    return keys.reduce((obj, k) => obj?.[k], localizedData) || key;
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    status: "in progress",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/contact", formData); // ✅ 상대경로

      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: getLocalizedText("contact.alerts.success"),
          confirmButtonColor: "#3085d6",
          confirmButtonText: "확인",
        });

        setFormData({
          name: "",
          email: "",
          phone: "",
          message: "",
          status: "in progress",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: getLocalizedText("contact.alerts.error"),
        confirmButtonColor: "#d33",
        confirmButtonText: "확인",
      });
    }
  };

  return (
    <motion.div
      key={language}
      className="min-h-screen bg-white py-32"
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="container mx-auto px-4 max-w-6xl"
        variants={fadeInVariants}
        custom={0}
      >
        {/* 제목 */}
        <motion.div
          className="text-center mb-16"
          variants={fadeInVariants}
          custom={1}
        >
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-6">
            {getLocalizedText("contact.title")}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {getLocalizedText("contact.subtitle")}
          </p>
        </motion.div>

        {/* 폼 & 연락처 */}
        <motion.div
          className="grid lg:grid-cols-2 gap-12 items-start"
          variants={fadeInVariants}
          custom={2}
        >
          {/* 폼 */}
          <motion.div
            className="bg-white rounded-2xl shadow-xl p-8"
            variants={fadeInVariants}
            custom={3}
          >
            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                {["name", "email", "phone"].map((field, index) => (
                  <motion.div
                    key={index}
                    variants={fadeInVariants}
                    custom={index + 4}
                  >
                    <label className="block text-gray-700 font-medium mb-2">
                      {getLocalizedText(`contact.form.${field}`)}
                    </label>
                    <input
                      type={field === "email" ? "email" : "text"}
                      name={field}
                      className="w-full p-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300"
                      placeholder={getLocalizedText(
                        `contact.form.placeholders.${field}`
                      )}
                      required
                      value={formData[field]}
                      onChange={handleChange}
                    />
                  </motion.div>
                ))}

                <motion.div variants={fadeInVariants} custom={6}>
                  <label className="block text-gray-700 font-medium mb-2">
                    {getLocalizedText("contact.form.message")}
                  </label>
                  <textarea
                    name="message"
                    className="w-full p-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-300 h-40"
                    placeholder={getLocalizedText(
                      "contact.form.placeholders.message"
                    )}
                    required
                    value={formData.message}
                    onChange={handleChange}
                  />
                </motion.div>

                <motion.button
                  className="w-full bg-blue-600 text-white py-4 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300"
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  {getLocalizedText("contact.form.submit")}
                </motion.button>
              </div>
            </form>
          </motion.div>

          {/* 연락처 정보 */}
          <motion.div
            className="space-y-8"
            variants={fadeInVariants}
            custom={7}
          >
            <motion.div
              className="bg-white rounded-2xl shadow-lg p-8"
              variants={fadeInVariants}
              custom={8}
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-6">
                {getLocalizedText("contact.contact_info.title")}
              </h3>
              <div className="space-y-6">
                {["phone", "email", "address"].map((key, index) => (
                  <motion.div
                    key={index}
                    className="flex items-center gap-4 p-4 border rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                    variants={fadeInVariants}
                    custom={index + 9}
                  >
                    {key === "phone" && (
                      <FiPhone className="text-blue-600 text-3xl" />
                    )}
                    {key === "email" && (
                      <FiMail className="text-blue-600 text-3xl" />
                    )}
                    {key === "address" && (
                      <FiMapPin className="text-blue-600 text-3xl" />
                    )}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-800">
                        {getLocalizedText(`contact.contact_info.${key}.title`)}
                      </h4>
                      <p className="text-gray-600">
                        {getLocalizedText(`contact.contact_info.${key}.info`)}
                      </p>
                      <p className="text-sm text-gray-500">
                        {getLocalizedText(`contact.contact_info.${key}.desc`)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            <motion.div
              className="bg-white rounded-2xl shadow-lg overflow-hidden"
              variants={fadeInVariants}
              custom={10}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3261.766221083579!2d128.1143747771263!3d35.16245065829543!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x356efc9d5bf27607%3A0xe3115b0fabe83ba3!2z6rK97IOB64Ko64-EIOynhOyjvOyLnCDtmLjtg4Trj5kgNjI0LTE5!5e0!3m2!1sko!2skr!4v1739346064238!5m2!1sko!2skr"
                width="100%"
                height="400"
                loading="lazy"
                className="w-full h-[400px] md:h-[600px] lg:h-[600px]"
              ></iframe>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Contact;
