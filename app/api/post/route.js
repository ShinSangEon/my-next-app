import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Post } from "@/models/Post";
import { verifyToken } from "@/lib/verifyToken";

export async function GET() {
  await dbConnect();

  try {
    const posts = await Post.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(posts);
  } catch (err) {
    console.error("게시글 불러오기 오류:", err);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}

export async function POST(req) {
  await dbConnect();

  try {
    // 인증 토큰 확인
    const token = req.cookies.get("token")?.value;
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ message: "인증 필요" }, { status: 401 });
    }

    const { title, content, fileUrl } = await req.json();

    // 게시글 번호 설정
    const latestPost = await Post.findOne().sort({ number: -1 }).lean();
    const nextNumber = latestPost?.number ? latestPost.number + 1 : 1;

    // 새 게시글 생성
    const newPost = new Post({
      number: nextNumber,
      title,
      content,
      fileUrl,
    });

    await newPost.save();

    return NextResponse.json(newPost, { status: 201 });
  } catch (err) {
    console.error("게시글 저장 오류:", err);
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}
