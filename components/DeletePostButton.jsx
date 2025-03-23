"use client";

import React from "react";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

const DeletePostButton = ({ id }) => {
  const router = useRouter();

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "정말 삭제하시겠습니까?",
      text: "삭제된 게시글은 복구할 수 없습니다.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "삭제",
      cancelButtonText: "취소",
    });

    if (result.isConfirmed) {
      try {
        const deleteRes = await fetch(`/api/post/${id}`, {
          method: "DELETE",
          credentials: "include",
        });

        if (deleteRes.ok) {
          await Swal.fire("삭제 완료", "게시글이 삭제되었습니다.", "success");
          router.push("/board");
        } else {
          await Swal.fire("삭제 실패", "다시 시도해주세요.", "error");
          router.push("/board");
        }
      } catch (error) {
        console.error("삭제 오류:", error);
        await Swal.fire("에러 발생", "서버 오류. 다시 시도해주세요.", "error");
        router.push("/board");
      }
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
    >
      삭제하기
    </button>
  );
};

export default DeletePostButton;
