import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { User } from "@/models/User";
import { verifyToken } from "@/lib/verifyToken";

export async function POST(req) {
  await dbConnect();
  try {
    const token = req.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { isValid: false, message: "토큰이 유효하지 않습니다." },
        { status: 400 }
      );
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { isValid: false, message: "토큰이 유효하지 않습니다." },
        { status: 401 }
      );
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        { isValid: false, message: "사용자를 찾을 수 없습니다." },
        { status: 401 }
      );
    }

    const now = new Date();
    const lastActiveAt = new Date(user.lastActiveAt);
    const inactiveTime = (now - lastActiveAt) / (1000 * 60);

    if (inactiveTime > 30) {
      user.isLoggedIn = false;
      await user.save();
      return NextResponse.json(
        { isValid: false, message: "세션 만료" },
        { status: 401 }
      );
    }

    user.lastActiveAt = now;
    await user.save();

    return NextResponse.json({ isValid: true, user: decoded });
  } catch (err) {
    return NextResponse.json(
      { isValid: false, message: "서버 오류" },
      { status: 500 }
    );
  }
}
