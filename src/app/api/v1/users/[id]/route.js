import connectDB from "@/lib/mongo";
import User from "@/model/User";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  await connectDB();
  try {
    const { id } = await params;
    const user = await User.findById(id).select("-senha");
    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  await connectDB();
  try {
    const { id } = await params;
    const body = await request.json();
    const user = await User.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  await connectDB();
  try {
    const { id } = await params;
    const user = await User.findByIdAndDelete(id);
    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 });
    }
    return NextResponse.json({ message: "Usuário deletado com sucesso" });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
