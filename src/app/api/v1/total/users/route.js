import { auth, db } from "@/lib/auth"
import { headers } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const total = await db.collection("user").countDocuments({})

    return NextResponse.json({ total })
  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao contar usuarios" },
      { status: 500 }
    )
  }
}