"use client";

import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import { useRouter } from "next/navigation";
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

  const router = useRouter();

  // 🔹 게시글 가져오기
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(`/api/post?_=${Date.now()}`);
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

  // 날짜 포맷 함수
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  return (
    <motion.div
      className="p-4 mx-auto max-w-7xl py-32"
      initial="hidden"
      animate="visible"
    >
      <motion.h1
        className="text-4xl font-bold mb-6 text-center"
        variants={fadeIn}
        custom={0}
      >
        {t("board.title")}
      </motion.h1>

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
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
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
                  onClick={() => router.push(`/post/${post._id}`)}
                  className="hover:bg-gray-50 cursor-pointer"
                  variants={fadeIn}
                  custom={3 + index}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    {filteredPosts.length -
                      ((currentPage - 1) * pageSize + index)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{post.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {formatDate(post.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{post.views}</td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </motion.div>

      {/* 모바일 카드 형태 */}
      <motion.div
        className="block md:hidden space-y-4"
        variants={fadeIn}
        custom={2}
      >
        {paginatedPosts.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            {t("board.noPosts")}
          </div>
        ) : (
          paginatedPosts.map((post, index) => (
            <motion.div
              key={post._id}
              onClick={() => router.push(`/post/${post._id}`)}
              className="border rounded-lg p-4 bg-white shadow cursor-pointer"
              variants={fadeIn}
              custom={3 + index}
            >
              <div className="text-lg font-bold mb-2">{post.title}</div>
              <div className="flex justify-between text-sm text-gray-500">
                <span>{formatDate(post.createdAt)}</span>
                <span>조회수 {post.views}</span>
              </div>
            </motion.div>
          ))
        )}
      </motion.div>

      {/* 페이징 */}
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
