"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useRouter } from "next/navigation"; // ✅ Next.js Router
import BoardLocale from "@/Locale/Board.json";

const Board = () => {
  const [posts, setPosts] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("title");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [language, setLanguage] = useState("ko");

  const router = useRouter(); // ✅ Next.js에서 페이지 이동

  // 🔹 게시글 가져오기
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("/api/post"); // ✅ 상대경로로 변경
        setPosts(response.data);
      } catch (error) {
        console.error("게시글 가져오기 실패: ", error);
      }
    };

    fetchPosts();
  }, []);

  // 🔹 언어 변경 감지
  useEffect(() => {
    if (typeof window !== "undefined") {
      const lang = localStorage.getItem("language") || "ko";
      setLanguage(lang);

      const handleLanguageChange = () => {
        setLanguage(localStorage.getItem("language") || "ko");
      };

      window.addEventListener("languageChange", handleLanguageChange);
      return () => {
        window.removeEventListener("languageChange", handleLanguageChange);
      };
    }
  }, []);

  const t = (key) => {
    const keys = key.split(".");
    return keys.reduce((obj, k) => obj[k], BoardLocale[language]);
  };

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const value = post[searchType]?.toLowerCase() || "";
      const matchesSearch = value.includes(searchTerm.toLowerCase());

      const postDate = new Date(post.createdAt).getTime();
      const start = startDate ? new Date(startDate).getTime() : null;
      const end = endDate ? new Date(endDate).getTime() : null;

      const matchesDate =
        (!start || postDate >= start) && (!end || postDate <= end);

      return matchesSearch && matchesDate;
    });
  }, [posts, searchTerm, searchType, startDate, endDate]);

  const totalPages =
    pageSize > 0 ? Math.ceil(filteredPosts.length / pageSize) : 1;

  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPosts.slice(start, start + pageSize);
  }, [filteredPosts, currentPage, pageSize]);

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, delay: i * 0.2 },
    }),
  };

  return (
    <motion.div
      className="p-4 mx-auto max-w-7xl py-32"
      initial="hidden"
      animate="visible"
    >
      {/* 제목 */}
      <motion.h1
        className="text-4xl font-bold mb-6 text-center"
        variants={fadeIn}
        custom={0}
      >
        {t("board.title")}
      </motion.h1>

      {/* 검색 및 필터 */}
      {/* (생략: 기존 코드 그대로 Next.js에서 잘 작동) */}

      {/* 테이블 */}
      <motion.div
        className="hidden md:block overflow-x-auto"
        variants={fadeIn}
        custom={2}
      >
        <table className="min-w-full bg-white border rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider w-[8%]">
                {t("board.table.number")}
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider w-auto">
                {t("board.table.title")}
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider w-[15%]">
                {t("board.table.date")}
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider w-[8%]">
                {t("board.table.views")}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedPosts.length === 0 ? (
              <tr>
                <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                  {t("board.noPosts")}
                </td>
              </tr>
            ) : (
              paginatedPosts.map((post, index) => (
                <motion.tr
                  key={post._id}
                  onClick={() => router.push(`/post/${post._id}`)} // ✅ Next.js에서는 router.push 사용
                  className="hover:bg-gray-50 cursor-pointer"
                  variants={fadeIn}
                  custom={3 + index}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    {(currentPage - 1) * pageSize + index + 1}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{post.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{post.views}</td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </motion.div>

      <motion.div
        className="md:hidden grid grid-cols-1 gap-4"
        variants={fadeIn}
        custom={3}
      >
        {paginatedPosts.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">
            {t("board.noPosts")}
          </div>
        ) : (
          paginatedPosts.map((post, index) => (
            <motion.div
              key={post._id}
              onClick={() => navigate(`/post/${post._id}`)}
              className="border rounded-lg p-4 bg-white shadow-md hover:shadow-lg transition-shadow"
              variants={fadeIn}
              custom={4 + index}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold truncate">{post.title}</h3>
                <span className="text-sm text-gray-500">
                  #{(currentPage - 1) * pageSize + index + 1}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3 truncate">
                작성일: {new Date(post.createdAt).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600">조회수: {post.views}</p>
            </motion.div>
          ))
        )}
      </motion.div>

      <motion.div
        className="mt-4 flex justify-center space-x-2 text-lg font-bold"
        variants={fadeIn}
        custom={5}
      >
        <button
          className="px-3 py-1 rounded border disabled:opacity-50"
          onClick={() => setCurrentPage((p) => p - 1)}
          disabled={currentPage === 1 || totalPages === 0}
        >
          {t("board.pagination.prev")}
        </button>
        <span className="px-3 py-1">
          {totalPages > 0 ? `${currentPage} / ${totalPages}` : "0 / 0"}
        </span>
        <button
          className="px-3 py-1 rounded border disabled:opacity-50"
          onClick={() => setCurrentPage((p) => p + 1)}
          disabled={currentPage >= totalPages || totalPages === 0}
        >
          {t("board.pagination.next")}
        </button>
      </motion.div>
    </motion.div>
  );
};

export default Board;
