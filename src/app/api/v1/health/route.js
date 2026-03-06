import { NextResponse } from "next/server"
import mongoose from "mongoose"

export async function GET() {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGO_DB_URL)
    }

    await mongoose.connection.db.admin().ping()

    return NextResponse.json({
      status: "ok",
      db: "connected",
      uptime: process.uptime(),
      timestamp: new Date()
    }, { status: 200 })

  } catch (error) {
    return NextResponse.json({
      status: "error",
      db: "disconnected",
      error: error.message
    }, { status: 500 })
  }
}