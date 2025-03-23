import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { User } from "@/models/User";
import { verifyToken } from "@/lib/verifyToken";
import jwt from "jsonwebtoken";

export async function POST(req) {
  await dbConnect();
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { message: "이미 로그아웃 상태입니다." },
        { status: 400 }
      );
    }

    const decoded = verifyToken(token);
    if (decoded) {
      const user = await User.findById(decoded.userId);
      if (user) {
        user.isLoggedIn = false;
        await user.save();
      }
    }

    const response = NextResponse.json({ message: "로그아웃되었습니다." });
    response.cookies.set("token", "", { maxAge: 0 });
    return response;
  } catch (err) {
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}
