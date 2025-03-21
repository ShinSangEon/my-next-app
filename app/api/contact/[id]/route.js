import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import { Contact } from "@/models/Contact";
import { verifyToken } from "@/lib/verifyToken";

export async function GET(req, { params }) {
  await dbConnect();
  try {
    const contact = await Contact.findById(params.id);
    if (!contact) {
      return NextResponse.json(
        { message: "문의를 찾을 수 없습니다." },
        { status: 404 }
      );
    }
    return NextResponse.json(contact);
  } catch (err) {
    return NextResponse.json({ message: "서버 에러 발생" }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  await dbConnect();
  try {
    const token = req.cookies.get("token")?.value;
    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { message: "유효하지 않은 토큰입니다." },
        { status: 403 }
      );
    }

    const { status } = await req.json();

    const contact = await Contact.findByIdAndUpdate(
      params.id,
      { status },
      { new: true }
    );

    if (!contact) {
      return NextResponse.json(
        { message: "문의를 찾을 수 없습니다." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "문의 상태가 성공적으로 수정되었습니다.",
      contact,
    });
  } catch (err) {
    return NextResponse.json({ message: "서버 에러 발생" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  await dbConnect();
  try {
    const token = req.cookies.get("token")?.value;
    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { message: "유효하지 않은 토큰입니다." },
        { status: 403 }
      );
    }

    const contact = await Contact.findByIdAndDelete(params.id);
    if (!contact) {
      return NextResponse.json(
        { message: "문의를 찾을 수 없습니다." },
        { status: 404 }
      );
    }
    return NextResponse.json({ message: "문의가 성공적으로 삭제되었습니다." });
  } catch (err) {
    return NextResponse.json({ message: "서버 에러 발생" }, { status: 500 });
  }
}
