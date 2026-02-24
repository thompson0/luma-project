import connectDB from "@/lib/mongo";
import User from "@/model/User";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  try {
    const users = await User.find({}).select("-senha");
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  await connectDB();
  try {
    const body = await request.json();
    const user = await User.create(body);
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
