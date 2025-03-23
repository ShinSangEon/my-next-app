import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Post } from "@/models/Post";
import { verifyToken } from "@/lib/verifyToken";
import { s3Client } from "@/lib/s3Client";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { marked } from "marked";
import axios from "axios";

function getS3KeyFromUrl(url) {
  try {
    const urlObj = new URL(url);
    return decodeURIComponent(urlObj.pathname.substring(1));
  } catch (error) {
    console.error("URL 파싱 에러:", error);
    return null;
  }
}

export async function GET(req, context) {
  const params = await context.params;
  const id = params.id;

  console.log("✅ API 요청 ID:", id);

  await dbConnect();
  try {
    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json({ message: "게시글 없음" }, { status: 404 });
    }

    // IP 확인
    let ip = req.ip || "unknown";
    // const ipResponse = await axios.get("https://api.ipify.org?format=json");
    // ip = ipResponse.data.ip;

    const userAgent = req.headers.get("user-agent");

    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const hasRecentView = post.viewLogs.some(
      (log) =>
        log.ip === ip &&
        log.userAgent === userAgent &&
        new Date(log.timestamp) > oneDayAgo
    );

    if (!hasRecentView) {
      post.views += 1;
      post.viewLogs.push({ ip, userAgent, timestamp: new Date() });
      await post.save();
    }

    let htmlContent;
    try {
      htmlContent = marked.parse(post.content || "");
    } catch (error) {
      htmlContent = post.content;
    }

    const responseData = {
      ...post.toObject(),
      renderedContent: htmlContent,
    };

    return NextResponse.json(responseData);
  } catch (err) {
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}

export async function PUT(req, context) {
  const params = await context.params;
  const id = params.id;
  await dbConnect();
  try {
    const token = req.cookies.get("token")?.value;
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ message: "인증 필요" }, { status: 401 });
    }

    const { title, content, fileUrl } = await req.json();
    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json({ message: "게시글 없음" }, { status: 404 });
    }

    // S3 파일 삭제
    const imgRegex =
      /https:\/\/[^"']*?\.(?:png|jpg|jpeg|gif|PNG|JPG|JPEG|GIF)/g;
    const oldContentImages = post.content.match(imgRegex) || [];
    const newContentImages = content.match(imgRegex) || [];

    const deletedImages = oldContentImages.filter(
      (url) => !newContentImages.includes(url)
    );
    const deletedFiles = (post.fileUrl || []).filter(
      (url) => !(fileUrl || []).includes(url)
    );

    const allDeletedFiles = [...deletedImages, ...deletedFiles];
    for (const fileUrl of allDeletedFiles) {
      const key = getS3KeyFromUrl(fileUrl);
      if (key) {
        try {
          await s3Client.send(
            new DeleteObjectCommand({
              Bucket: process.env.AWS_BUCKET_NAME,
              Key: key,
            })
          );
        } catch (err) {
          console.error("S3 삭제 에러:", err);
          return NextResponse.json(
            { message: "파일 삭제 실패", error: err.message },
            { status: 500 }
          );
        }
      }
    }

    post.title = title;
    post.content = content;
    post.fileUrl = fileUrl;
    post.updatedAt = Date.now();

    await post.save();

    return NextResponse.json(post);
  } catch (err) {
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}

export async function DELETE(req, context) {
  const params = await context.params;
  const id = params.id;
  await dbConnect();
  try {
    const token = req.cookies.get("token")?.value;
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ message: "인증 필요" }, { status: 401 });
    }

    const post = await Post.findById(id);
    if (!post) {
      return NextResponse.json({ message: "게시글 없음" }, { status: 404 });
    }

    // S3 삭제
    const imgRegex =
      /https:\/\/[^"']*?\.(?:png|jpg|jpeg|gif|PNG|JPG|JPEG|GIF)/g;
    const contentImages = post.content.match(imgRegex) || [];
    const allFiles = [...contentImages, ...(post.fileUrl || [])];

    for (const fileUrl of allFiles) {
      const key = getS3KeyFromUrl(fileUrl);
      if (key) {
        try {
          await s3Client.send(
            new DeleteObjectCommand({
              Bucket: process.env.AWS_BUCKET_NAME,
              Key: key,
            })
          );
        } catch (err) {
          console.error("S3 삭제 에러:", err);
        }
      }
    }

    await post.deleteOne();
    return NextResponse.json({ message: "게시글과 파일 삭제 완료" });
  } catch (err) {
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}
