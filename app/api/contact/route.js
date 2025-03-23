import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import { Contact } from "@/models/Contact";

export async function GET() {
  await dbConnect();
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    return NextResponse.json(contacts);
  } catch (err) {
    return NextResponse.json({ message: "서버 에러 발생" }, { status: 500 });
  }
}

export async function POST(req) {
  await dbConnect();
  try {
    const body = await req.json();
    const { name, email, phone, message, status } = body;

    const contact = new Contact({
      name,
      email,
      phone,
      message,
      status,
    });

    await contact.save();
    return NextResponse.json(
      { message: "문의가 성공적으로 등록되었습니다." },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json({ message: "서버 에러 발생" }, { status: 500 });
  }
}
