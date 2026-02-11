import { NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { serialize } from "cookie"
import { signToken } from "@/lib/jwt"
import connectDB from "@/lib/dbConnect"
import User from "@/model/User"

export async function POST(req) {
  try {
    await connectDB()

    const { email, senha } = await req.json()

    const user = await User.findOne({ email })

    if (!user) {
      return NextResponse.json(
        { message: "Usuário não encontrado" },
        { status: 401 }
      )
    }

    const isValid = await bcrypt.compare(senha, user.senha)

    if (!isValid) {
      return NextResponse.json(
        { message: "Senha incorreta" },
        { status: 401 }
      )
    }

    const token = signToken({
      id: user._id.toString(),
      role: user.role,
      name: user.name
    })

    const cookie = serialize("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 8, // 8 horas
      path: "/"
    })

    return new NextResponse(
      JSON.stringify({
        message: "Login feito com sucesso",
        role: user.role,
        name: user.name
      }),
      {
        status: 200,
        headers: {
          "Set-Cookie": cookie,
          "Content-Type": "application/json"
        }
      }
    )

  } catch (error) {
    return NextResponse.json(
      { message: "Erro interno no servidor" },
      { status: 500 }
    )
  }
}
