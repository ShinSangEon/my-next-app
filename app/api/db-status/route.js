// app/api/db-status/route.js
import dbConnect from "@/lib/dbConnect";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();

  const states = ["Disconnected", "Connected", "Connecting", "Disconnecting"];
  const state = mongoose.connection.readyState;

  return NextResponse.json({
    status: states[state],
  });
}
