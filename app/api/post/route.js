import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { Post } from "@/models/Post";
import { verifyToken } from "@/lib/verifyToken";

export async function GET() {
  await dbConnect();
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    return NextResponse.json(posts);
  } catch (err) {
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}

export async function POST(req) {
  await dbConnect();
  try {
    const token = req.cookies.get("token")?.value;
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ message: "인증 필요" }, { status: 401 });
    }

    const { title, content, fileUrl } = await req.json();

    const latestPost = await Post.findOne().sort({ number: -1 });
    const nextNumber = latestPost ? latestPost.number + 1 : 1;

    const post = new Post({
      number: nextNumber,
      title,
      content,
      fileUrl,
    });

    await post.save();

    return NextResponse.json(post, { status: 201 });
  } catch (err) {
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}
