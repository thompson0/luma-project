import { NextResponse } from "next/server"
import connectDB from "@/lib/mongo"
import Pecas from "@/model/Pecas"

export async function DELETE(_, context) {
  try {
    await connectDB()

    const { id } = await context.params 

    const deleted = await Pecas.findByIdAndDelete(id)

    if (!deleted) {
      return NextResponse.json(
        { error: "Peça não encontrada" },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { message: "Peça deletada com sucesso" },
      { status: 200 }
    )

  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao deletar peça" },
      { status: 500 }
    )
  }
}

export async function PUT(request, context) {
  try {
    await connectDB()

    const { id } = await context.params // 👈 importante

    const body = await request.json()

    const pecaAtualizada = await Pecas.findByIdAndUpdate(
      id,
      body,
      {
        new: true,
        runValidators: true
      }
    )

    if (!pecaAtualizada) {
      return NextResponse.json(
        { error: "Peça não encontrada" },
        { status: 404 }
      )
    }

    return NextResponse.json(pecaAtualizada, { status: 200 })

  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    )
  }
}
