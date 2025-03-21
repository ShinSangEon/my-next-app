import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { User } from "@/models/User";
import bcrypt from "bcrypt";

export async function POST(req) {
  await dbConnect();
  try {
    const { username, email, password } = await req.json();

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json(
        { message: "이미 존재하는 사용자입니다." },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      isActive: true,
      failedLoginAttempts: 0,
      isLoggedIn: false,
    });

    await user.save();

    return NextResponse.json(
      { message: "회원가입이 완료되었습니다." },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json({ message: "서버 오류 발생" }, { status: 500 });
  }
}
