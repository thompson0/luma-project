import connectDB from "@/lib/mongo"
import Pecas from "@/model/Pecas"

export async function GET() {
  try {
    await connectDB()

    const total = await Pecas.countDocuments({})

    return Response.json({ total })
  } catch (error) {
    return Response.json(
      { error: "Erro ao contar peças" },
      { status: 500 }
    )
  }
}