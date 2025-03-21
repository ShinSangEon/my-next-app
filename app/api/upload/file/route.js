import { NextResponse } from "next/server";
import { s3Client } from "@/lib/s3Client";
import { PutObjectCommand } from "@aws-sdk/client-s3";
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
    const file = formData.get("file");
    const originalName = formData.get("originalName");

    if (!file || !originalName) {
      return NextResponse.json(
        { message: "파일 또는 파일명 없음" },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const decodedFileName = decodeURIComponent(originalName);

    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `post-files/${decodedFileName}`,
      Body: buffer,
      ContentType: file.type,
      ContentDisposition: `attachment; filename*=UTF-8''${encodeURIComponent(
        decodedFileName
      )}`,
    };

    await s3Client.send(new PutObjectCommand(uploadParams));

    const fileUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/post-files/${decodedFileName}`;

    return NextResponse.json({ fileUrl, originalName: decodedFileName });
  } catch (error) {
    console.error("S3 업로드 에러:", error);
    return NextResponse.json(
      { error: "파일 업로드 중 에러 발생" },
      { status: 500 }
    );
  }
}
