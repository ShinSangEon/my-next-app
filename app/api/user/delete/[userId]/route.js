import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { User } from "@/models/User";

export async function DELETE(req, { params }) {
  await dbConnect();
  try {
    const user = await User.findByIdAndDelete(params.userId);
    if (!user) {
      return NextResponse.json(
        { message: "사용자를 찾을 수 없습니다." },
        { status: 404 }
      );
    }
    return NextResponse.json({
      message: "사용자가 성공적으로 삭제되었습니다.",
    });
  } catch (err) {
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}
