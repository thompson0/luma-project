import { NextResponse } from "next/server"
import connectDB from "@/lib/mongo"
import Pecas from "@/model/Pecas"

export async function GET(request) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)

    const nome = searchParams.get("nome")
    const minPreco = searchParams.get("minPreco")
    const maxPreco = searchParams.get("maxPreco")
    const dataInicio = searchParams.get("dataInicio")
    const dataFim = searchParams.get("dataFim")

    let page = Number(searchParams.get("page")) || 1
    let limit = Number(searchParams.get("limit")) || 10

    if (limit > 30) limit = 30

    const skip = (page - 1) * limit

    let filtro = {}

    if (nome) {
      filtro.name = { $regex: nome, $options: "i" }
    }

    if (minPreco || maxPreco) {
      filtro.preco = {}
      if (minPreco) filtro.preco.$gte = Number(minPreco)
      if (maxPreco) filtro.preco.$lte = Number(maxPreco)
    }

    if (dataInicio || dataFim) {
      filtro.createdAt = {}
      if (dataInicio) filtro.createdAt.$gte = new Date(dataInicio)
      if (dataFim) filtro.createdAt.$lte = new Date(dataFim)
    }

    const total = await Pecas.countDocuments(filtro)

    const pecas = await Pecas.find(filtro)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    return NextResponse.json({
      data: pecas,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    return NextResponse.json(
      { error: "Erro ao buscar peças" },
      { status: 500 }
    )
  }
}


export async function POST(request) {
  try {
    await connectDB()

    const body = await request.json()

    const novaPeca = await Pecas.create(body)

    return NextResponse.json(novaPeca, { status: 201 })

  } catch (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 400 }
    )
  }
}
