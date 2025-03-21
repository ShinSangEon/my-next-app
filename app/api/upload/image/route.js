import { NextResponse } from "next/server";
import { s3Client } from "@/lib/s3Client";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import { verifyToken } from "@/lib/verifyToken";

export async function POST(req) {
  try {
    const token = req.cookies.get("token")?.value;
    if (!token || !verifyToken(token)) {
      return NextResponse.json(
        { message: "인증되지 않은 요청입니다." },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("image");

    if (!file) {
      return NextResponse.json(
        { message: "파일이 없습니다." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileExtension = file.name.split(".").pop();
    const fileName = `${uuidv4()}.${fileExtension}`;

    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `post-images/${fileName}`,
      Body: buffer,
      ContentType: file.type,
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    const imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/post-images/${fileName}`;

    return NextResponse.json({ imageUrl });
  } catch (error) {
    console.error("S3 업로드 에러:", error);
    return NextResponse.json(
      { error: "이미지 업로드 중 에러 발생" },
      { status: 500 }
    );
  }
}
