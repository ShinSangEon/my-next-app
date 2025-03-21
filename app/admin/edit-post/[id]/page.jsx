"use client";

import { Editor } from "@tinymce/tinymce-react";
import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useRouter, useParams } from "next/navigation";

const AdminEditPost = () => {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    files: [],
    fileList: [],
    existingFiles: [],
  });

  const editorRef = useRef(null);
  const [uploadProgress, setUploadProgress] = useState({});
  const [currentUpload, setCurrentUpload] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);

  // 게시글 불러오기
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/api/post/${id}`);
        setFormData({
          title: response.data.title,
          content: response.data.content,
          files: [],
          fileList: [],
          existingFiles: response.data.fileUrl || [],
        });
      } catch (error) {
        console.log("게시물을 가져오던 중 에러발생: ", error);
        router.push("/admin/posts");
      }
    };
    fetchPost();
  }, [id, router]);

  // 파일 업로드 모달
  const UploadModal = ({ progress, fileName }) =>
    showUploadModal && (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            파일 업로드 중...
          </h3>
          <p className="text-sm text-gray-600 mb-4">{fileName}</p>
          <div className="relative pt-1">
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-gray-200">
              <div
                style={{ width: `${progress}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
              />
            </div>
            <div className="text-center text-sm text-gray-600">
              {progress.toFixed(0)}%
            </div>
          </div>
        </div>
      </div>
    );

  // 게시글 수정 요청
  const handleSubmit = async (e) => {
    e.preventDefault();
    const editorContent = editorRef.current.getContent();
    setShowUploadModal(true);

    try {
      // 현재 마크다운에서 이미지 URL 파싱
      const imgRegex =
        /https:\/\/[^"']*?\.(?:png|jpg|jpeg|gif|PNG|JPG|JPEG|GIF)/g;
      const currentImages = editorContent.match(imgRegex) || [];

      // 새 파일 업로드
      const uploadedFiles = await Promise.all(
        formData.files.map(async (file) => {
          setCurrentUpload(file.name);
          const fileFormData = new FormData();
          const encodedFileName = encodeURIComponent(file.name);
          fileFormData.append("file", file);
          fileFormData.append("originalName", encodedFileName);

          const response = await axios.post(`/api/upload/file`, fileFormData, {
            withCredentials: true,
            headers: {
              "Content-Type": "multipart/form-data",
            },
            onUploadProgress: (progressEvent) => {
              const percentCompleted = Math.round(
                (progressEvent.loaded * 100) / progressEvent.total
              );
              setUploadProgress((prev) => ({
                ...prev,
                [file.name]: percentCompleted,
              }));
            },
          });
          return response.data.fileUrl;
        })
      );

      const postData = {
        title: formData.title,
        content: editorContent,
        fileUrl: [...formData.existingFiles, ...uploadedFiles],
        currentImages: currentImages,
      };

      await axios.put(`/api/post/${id}`, postData, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      setShowUploadModal(false);
      router.push("/admin/posts");
    } catch (error) {
      console.error("게시물 수정 중 에러발생:", error);
      setShowUploadModal(false);
    }
  };

  // 새 파일 추가
  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);

    const newFileList = newFiles.map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      file: file,
    }));

    setFormData((prev) => ({
      ...prev,
      files: [...prev.files, ...newFiles],
      fileList: [...prev.fileList, ...newFileList],
    }));
  };

  // 기존 파일 삭제
  const handleExistingFileDelete = (fileUrl) => {
    setFormData((prev) => ({
      ...prev,
      existingFiles: prev.existingFiles.filter((url) => url !== fileUrl),
    }));
  };

  // 새로 추가한 파일 삭제
  const handleFileDelete = (fileId) => {
    setFormData((prev) => ({
      ...prev,
      files: prev.files.filter(
        (_, index) => prev.fileList[index].id !== fileId
      ),
      fileList: prev.fileList.filter((file) => file.id !== fileId),
    }));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="bg-white rounded-lg shadow-lg p-4 sm:p-8">
        <h2 className="text-3xl font-bold mb-8 text-gray-800">게시물 수정</h2>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* 제목 */}
          <div>
            <label className="block text-lg font-medium mb-2">제목</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:ring-indigo-500 text-base p-2"
              required
            />
          </div>

          {/* 내용 */}
          <div>
            <label className="block text-lg font-medium mb-2">내용</label>
            <Editor
              apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
              onInit={(evt, editor) => (editorRef.current = editor)}
              initialValue={formData.content}
              init={{
                height: 500,
                menubar: true,
                plugins: [
                  "advlist",
                  "autolink",
                  "lists",
                  "link",
                  "image",
                  "preview",
                  "code",
                  "fullscreen",
                ],
                toolbar:
                  "undo redo | formatselect | bold italic | alignleft aligncenter alignright | bullist numlist | image | code",
                images_upload_handler: async (blobInfo) => {
                  const imgData = new FormData();
                  imgData.append("image", blobInfo.blob());

                  const response = await axios.post(
                    "/api/upload/image",
                    imgData,
                    {
                      withCredentials: true,
                      headers: { "Content-Type": "multipart/form-data" },
                    }
                  );

                  return response.data.imageUrl;
                },
              }}
            />
          </div>

          {/* 기존 파일 */}
          {formData.existingFiles.length > 0 && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">기존 첨부파일:</h3>
              <ul className="bg-gray-50 rounded-lg divide-y divide-gray-200">
                {formData.existingFiles.map((fileUrl, index) => (
                  <li
                    key={index}
                    className="flex items-center justify-between px-4 py-3"
                  >
                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-indigo-600 hover:text-indigo-800"
                    >
                      {decodeURIComponent(fileUrl.split("/").pop())}
                    </a>
                    <button
                      type="button"
                      onClick={() => handleExistingFileDelete(fileUrl)}
                      className="text-red-600 hover:text-red-800"
                    >
                      삭제
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 새 파일 추가 */}
          <div>
            <label className="block text-lg font-medium mb-2">
              새 첨부파일 추가
            </label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="mt-1 block w-full text-base text-gray-500"
            />

            {formData.fileList.length > 0 && (
              <div className="mt-4 space-y-2">
                {formData.fileList.map((file) => (
                  <div
                    key={file.id}
                    className="flex justify-between items-center p-2 bg-gray-50 rounded"
                  >
                    <span>
                      {file.name} ({formatFileSize(file.size)})
                    </span>
                    <button
                      type="button"
                      onClick={() => handleFileDelete(file.id)}
                      className="text-red-500"
                    >
                      삭제
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 버튼 */}
          <div className="flex justify-end gap-4">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg"
            >
              수정
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin/posts")}
              className="border px-6 py-2 rounded-lg"
            >
              취소
            </button>
          </div>
        </form>
      </div>

      <UploadModal
        progress={uploadProgress[currentUpload] || 0}
        fileName={currentUpload || ""}
      />
    </div>
  );
};

export default AdminEditPost;
