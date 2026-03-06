import { auth, db } from "@/lib/auth"
import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { ObjectId } from "mongodb"

// Tenta converter pra ObjectId, senão usa string
function toId(id) {
  try {
    return ObjectId.isValid(id) ? new ObjectId(id) : id
  } catch {
    return id
  }
}

export async function GET(request, { params }) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { id } = await params
    const user = await db.collection("user").findOne({ _id: toId(id) })

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()

    // Não permite atualizar campos sensíveis
    delete body._id
    delete body.email

    const result = await db.collection("user").findOneAndUpdate(
      { _id: toId(id) },
      { $set: { ...body, updatedAt: new Date() } },
      { returnDocument: "after" }
    )

    if (!result) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    if (!session) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 })
    }

    const { id } = await params
    const objectId = toId(id)

    const user = await db.collection("user").findOneAndDelete({ _id: objectId })

    if (!user) {
      return NextResponse.json({ error: "Usuário não encontrado" }, { status: 404 })
    }

    // Limpa sessions e accounts associadas do Better Auth
    await db.collection("session").deleteMany({ userId: id })
    await db.collection("account").deleteMany({ userId: id })

    return NextResponse.json({ message: "Usuário deletado com sucesso" })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
