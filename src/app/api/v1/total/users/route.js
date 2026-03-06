import connectDB from "@/lib/mongo"
import User from "@/model/User"

export async function GET() {
  try {
    await connectDB()

    const total = await User.countDocuments({})

    return Response.json({ total })
  } catch (error) {
    return Response.json(
      { error: "Erro ao contar usuarios" },
      { status: 500 }
    )
  }
}