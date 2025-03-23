import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { User } from "@/models/User";
import bcrypt from "bcryptjs";

import jwt from "jsonwebtoken";
import axios from "axios";

export async function POST(req) {
  await dbConnect();
  try {
    const { username, password } = await req.json();

    const user = await User.findOne({ username }).select("+password");
    if (!user) {
      return NextResponse.json(
        { message: "사용자를 찾을 수 없습니다." },
        { status: 401 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json(
        { message: "비활성화된 계정입니다." },
        { status: 401 }
      );
    }

    // if (user.isLoggedIn) {
    //   return NextResponse.json(
    //     { message: "이미 다른 기기에서 로그인되어 있습니다." },
    //     { status: 401 }
    //   );
    // }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      user.failedLoginAttempts += 1;
      user.lastLoginAttempt = new Date();

      if (user.failedLoginAttempts >= 5) {
        user.isActive = false;
        await user.save();
        return NextResponse.json(
          { message: "비밀번호 5회 오류로 계정 비활성화" },
          { status: 401 }
        );
      }

      await user.save();
      return NextResponse.json(
        {
          message: "비밀번호가 일치하지 않습니다.",
          remainingAttempts: 5 - user.failedLoginAttempts,
        },
        { status: 401 }
      );
    }

    // 로그인 성공
    user.failedLoginAttempts = 0;
    user.lastLoginAttempt = new Date();
    // user.isLoggedIn = true;

    try {
      const response = await axios.get("https://api.ipify.org?format=json");
      user.ipAddress = response.data.ip;
    } catch (err) {}

    await user.save();

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    const response = NextResponse.json({
      user: {
        username: user.username,
        email: user.email,
      },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60,
    });

    return response;
  } catch (err) {
    return NextResponse.json({ message: "서버 오류" }, { status: 500 });
  }
}
