"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const AdminPosts = () => {
  const [posts, setPosts] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchType, setSearchType] = useState("title");
  const router = useRouter();

  // 게시글 데이터 불러오기
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/post", { cache: "no-store" });
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.log("게시글 불러오기 실패: ", err);
      }
    };

    fetchPosts();
  }, []);

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "삭제하시겠습니까?",
      text: "이 작업은 되돌릴 수 없습니다!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/post/${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          setPosts(posts.filter((post) => post._id !== id));
          Swal.fire("삭제완료!", "게시글이 삭제되었습니다.", "success");
        } else {
          Swal.fire("실패!", "삭제 중 오류 발생.", "error");
        }
      } catch (err) {
        console.error("삭제 실패:", err);
        Swal.fire("오류 발생!", "삭제 중 문제가 발생했습니다.", "error");
      }
    }
  };

  const getFileNameFromUrl = (url) => {
    if (!url) return "";
    if (typeof url !== "string") return "";
    const parts = url.split("/");
    return parts[parts.length - 1];
  };

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const value = post[searchType]?.toLowerCase() || "";
      return value.includes(searchTerm.toLowerCase());
    });
  }, [posts, searchTerm, searchType]);

  const totalPages =
    pageSize > 0 ? Math.ceil(filteredPosts.length / pageSize) : 1;

  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPosts.slice(start, start + pageSize);
  }, [filteredPosts, currentPage, pageSize]);

  return (
    <div className="p-4 mx-auto max-w-[1700px]">
      <h1 className="text-4xl font-bold mt-6 mb-4">게시글 관리</h1>

      <div className="mb-4 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex w-full md:w-auto gap-2">
          <select
            className="border rounded px-3 py-2 text-base"
            value={searchType}
            onChange={(e) => setSearchType(e.target.value)}
          >
            <option value="title">제목</option>
            <option value="content">글 내용</option>
          </select>
          <div className="flex-1 md:w-80">
            <input
              type="text"
              placeholder="검색어를 입력하세요"
              className="w-full border rounded px-3 py-2 text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={() => router.push("/admin/create-post")}
          className="w-full md:w-auto bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-center"
        >
          추가하기
        </button>
      </div>

      {/* 게시글 테이블 */}
      {/* 👉 기존 테이블, 모바일용 카드 리스트 그대로 복붙 가능! */}

      {/* 페이징, 삭제 버튼은 기존과 동일 */}
    </div>
  );
};

export default AdminPosts;
