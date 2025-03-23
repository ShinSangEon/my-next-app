import React from "react";
import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import DeletePostButton from "@/components/DeletePostButton"; // ✅ 삭제 버튼 컴포넌트 import

export async function generateMetadata(context) {
  const params = await context.params;
  const id = params.id;
  return {
    title: `게시글 | ${id}`,
  };
}

export default async function PostDetailPage(context) {
  const params = await context.params;
  const id = params.id;

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value || "";

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/post/${id}`,
    {
      headers: { Cookie: `token=${token}` },
      cache: "no-store",
    }
  );

  if (!res.ok) return notFound();

  const post = await res.json();

  return (
    <div className="max-w-5xl mx-auto p-6 mt-16 bg-white rounded-3xl shadow-xl border border-gray-200">
      {/* 제목 + 날짜 + 조회수 */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4 sm:mb-0">
          {post.title}
        </h1>
        <div className="flex items-center space-x-3">
          <span className="bg-indigo-100 text-indigo-700 text-sm font-semibold px-3 py-1 rounded-full">
            조회수 {post.views}
          </span>
          <span className="bg-green-100 text-green-700 text-sm font-semibold px-3 py-1 rounded-full">
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      {/* 첨부파일 */}
      {post.fileUrl?.length > 0 && (
        <div className="mb-8 bg-gray-50 p-4 rounded-lg shadow-sm">
          <h3 className="font-semibold text-gray-700 mb-2">첨부파일</h3>
          <ul className="list-disc list-inside space-y-1">
            {post.fileUrl.map((url, idx) => (
              <li key={idx}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline hover:text-blue-700 transition"
                >
                  파일 {idx + 1}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 본문 */}
      <div
        className="prose prose-lg max-w-none mb-12"
        dangerouslySetInnerHTML={{ __html: post.renderedContent }}
      />

      {/* 하단 버튼 */}
      <div className="flex justify-end space-x-3">
        <a
          href="/board"
          className="px-6 py-2 bg-gray-100 text-gray-800 rounded-lg hover:bg-gray-200 transition"
        >
          목록으로
        </a>
        <a
          href={`/admin/edit-post/${post._id}`}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition"
        >
          수정하기
        </a>
        {/* ✅ 삭제 버튼 (클라이언트 컴포넌트) */}
        <DeletePostButton id={post._id} />
      </div>
    </div>
  );
}
