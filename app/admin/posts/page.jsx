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

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/post", {
          cache: "no-store",
          credentials: "include",
        });
        if (res.status === 401) {
          Swal.fire("권한이 없습니다", "로그인 후 이용해주세요", "warning");
          router.push("/admin/login");
          return;
        }
        const data = await res.json();
        setPosts(data);
      } catch (err) {
        console.log("게시글 불러오기 실패: ", err);
      }
    };

    fetchPosts();
  }, [router]);

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

      {/* 데스크탑 테이블 */}
      <div className="hidden md:block overflow-x-auto">
        <table className="min-w-full bg-white border rounded-lg">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                번호
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                제목
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                작성일
              </th>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                파일
              </th>
              <th className="px-6 py-3 text-center text-sm font-medium text-gray-500 uppercase tracking-wider">
                수정 / 삭제
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {paginatedPosts.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                  게시글이 없습니다.
                </td>
              </tr>
            ) : (
              paginatedPosts.map((post, index) => (
                <tr key={post._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    {(currentPage - 1) * pageSize + index + 1}
                  </td>
                  <td
                    className="px-6 py-4 cursor-pointer hover:text-blue-500"
                    onClick={() => router.push(`/post/${post._id}`)}
                  >
                    {post.title}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(post.createdAt).toLocaleDateString("ko-KR")}
                  </td>
                  <td className="px-6 py-4">
                    {post.fileUrl?.length > 0
                      ? post.fileUrl.map((url, i) => (
                          <a
                            key={i}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline block"
                          >
                            {getFileNameFromUrl(url)}
                          </a>
                        ))
                      : "없음"}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      className="text-green-500 hover:underline mr-2"
                      onClick={() =>
                        router.push(`/admin/edit-post/${post._id}`)
                      }
                    >
                      수정
                    </button>
                    <button
                      onClick={() => handleDelete(post._id)}
                      className="text-red-500 hover:underline"
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 모바일 카드 */}
      <div className="block md:hidden space-y-4">
        {paginatedPosts.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            게시글이 없습니다.
          </div>
        ) : (
          paginatedPosts.map((post, index) => (
            <div
              key={post._id}
              className="border rounded-lg p-4 bg-white shadow"
            >
              <div
                className="text-lg font-bold mb-2 cursor-pointer hover:text-blue-500"
                onClick={() => router.push(`/post/${post._id}`)}
              >
                {post.title}
              </div>
              <div className="text-sm text-gray-500 mb-2">
                작성일: {new Date(post.createdAt).toLocaleDateString("ko-KR")}
              </div>
              <div className="mb-2">
                파일:{" "}
                {post.fileUrl?.length > 0
                  ? post.fileUrl.map((url, i) => (
                      <a
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 underline block"
                      >
                        {getFileNameFromUrl(url)}
                      </a>
                    ))
                  : "없음"}
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => router.push(`/admin/edit-post/${post._id}`)}
                  className="text-green-500 hover:underline"
                >
                  수정
                </button>
                <button
                  onClick={() => handleDelete(post._id)}
                  className="text-red-500 hover:underline"
                >
                  삭제
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 페이징 */}
      <div className="mt-6 flex justify-center space-x-2 text-lg font-bold">
        <button
          className="px-3 py-1 rounded border disabled:opacity-50"
          onClick={() => setCurrentPage((p) => p - 1)}
          disabled={currentPage === 1 || totalPages === 0}
        >
          이전
        </button>
        <span className="px-3 py-1">
          {totalPages > 0 ? `${currentPage} / ${totalPages}` : "0 / 0"}
        </span>
        <button
          className="px-3 py-1 rounded border disabled:opacity-50"
          onClick={() => setCurrentPage((p) => p + 1)}
          disabled={currentPage >= totalPages || totalPages === 0}
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default AdminPosts;
