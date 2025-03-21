"use client";

import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";

const AdminNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "/api/user/logout",
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        router.push("/admin");
      }
    } catch (error) {
      console.log("로그아웃 실패: ", error);
    }
  };

  return (
    <div className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/admin/posts" className="text-xl font-bold">
              관리자 페이지
            </Link>
          </div>

          <div className="hidden text-lg lg:flex items-center space-x-4">
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
            <button
              onClick={handleLogout}
              className="hover:bg-gray-700 px-3 py-2 rounded text-white"
            >
              로그아웃
            </button>
          </div>

          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md hover:bg-gray-700"
            >
              {isOpen ? <HiX size={24} /> : <HiMenu size={24} />}
            </button>
          </div>
        </div>

        {isOpen && (
          <div className="lg:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                href="/admin/posts"
                className="block hover:bg-gray-700 px-3 py-2 rounded"
                onClick={() => setIsOpen(false)}
              >
                게시글
              </Link>
              <Link
                href="/admin/contacts"
                className="block hover:bg-gray-700 px-3 py-2 rounded"
                onClick={() => setIsOpen(false)}
              >
                문의 관리
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="block w-full text-left hover:bg-gray-700 px-3 py-2 rounded"
              >
                로그아웃
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminNavbar;
