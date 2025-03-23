"use client";

import { useState, useEffect, useCallback } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import axios from "axios";
import Swal from "sweetalert2";

const AdminNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  // 로그인 상태 체크 함수
  const checkAuth = useCallback(async () => {
    try {
      const res = await axios.get("/api/user/verify-token", {
        withCredentials: true,
        headers: { "Cache-Control": "no-store" },
      });

      setIsLoggedIn(res.data.isValid);
    } catch (err) {
      setIsLoggedIn(false);
    }
  }, []);

  // 페이지 경로가 변경될 때마다 로그인 상태 다시 체크
  useEffect(() => {
    checkAuth();
  }, [pathname, checkAuth]);

  // 로그아웃 처리
  const handleLogout = async () => {
    try {
      const res = await axios.post(
        "/api/user/logout",
        {},
        { withCredentials: true }
      );
      if (res.status === 200) {
        await Swal.fire(
          "로그아웃 완료",
          "성공적으로 로그아웃되었습니다.",
          "success"
        );
        setIsLoggedIn(false);
        router.replace("/admin/login");
      }
    } catch (error) {
      Swal.fire("로그아웃 실패", "다시 시도해 주세요.", "error");
      console.error("로그아웃 실패:", error);
    }
  };

  // 로그인 페이지로 이동
  const handleLoginRedirect = () => {
    router.push("/admin/login");
  };

  return (
    <div className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/admin/posts" className="text-xl font-bold">
            관리자 페이지
          </Link>

          <div className="hidden lg:flex items-center space-x-4 text-lg">
            <Link
              href="/admin/posts"
              className="hover:bg-gray-700 px-3 py-2 rounded"
            >
              게시글
            </Link>
            <Link
              href="/admin/contacts"
              className="hover:bg-gray-700 px-3 py-2 rounded"
            >
              문의 관리
            </Link>
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="hover:bg-gray-700 px-3 py-2 rounded"
              >
                로그아웃
              </button>
            ) : (
              <button
                onClick={handleLoginRedirect}
                className="hover:bg-gray-700 px-3 py-2 rounded"
              >
                로그인
              </button>
            )}
          </div>

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-md hover:bg-gray-700"
          >
            {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
          </button>
        </div>

        {isOpen && (
          <div className="lg:hidden px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/admin/posts"
              onClick={() => setIsOpen(false)}
              className="block hover:bg-gray-700 px-3 py-2 rounded"
            >
              게시글
            </Link>
            <Link
              href="/admin/contacts"
              onClick={() => setIsOpen(false)}
              className="block hover:bg-gray-700 px-3 py-2 rounded"
            >
              문의 관리
            </Link>
            {isLoggedIn ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="block w-full text-left hover:bg-gray-700 px-3 py-2 rounded"
              >
                로그아웃
              </button>
            ) : (
              <button
                onClick={() => {
                  handleLoginRedirect();
                  setIsOpen(false);
                }}
                className="block w-full text-left hover:bg-gray-700 px-3 py-2 rounded"
              >
                로그인
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNavbar;
