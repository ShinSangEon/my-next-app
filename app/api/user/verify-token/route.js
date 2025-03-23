import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/dbConnect";
import { User } from "@/models/User";
import { verifyToken } from "@/lib/verifyToken";

export async function GET() {
  await dbConnect();

  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { isValid: false, message: "토큰이 존재하지 않습니다." },
        { status: 401 }
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
    const lastActiveAt = user.lastActiveAt ? new Date(user.lastActiveAt) : now;
    const inactiveTime = (now - lastActiveAt) / (1000 * 60);

    if (inactiveTime > 30) {
      user.isLoggedIn = false;
      await user.save();
      cookieStore.delete("token"); // ✅ 만료 시 토큰 삭제
      return NextResponse.json(
        { isValid: false, message: "세션이 만료되었습니다." },
        { status: 401 }
      );
    }

    user.lastActiveAt = now;
    await user.save();

    return NextResponse.json({ isValid: true, user: decoded });
  } catch (err) {
    console.error("토큰 검증 에러:", err);
    return NextResponse.json(
      { isValid: false, message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
