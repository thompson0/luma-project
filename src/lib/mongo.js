import mongoose from "mongoose"

const MONGO_DB_URL = process.env.MONGO_DB_URL

if (!MONGO_DB_URL) {
  throw new Error("MONGO_DB_URL não definida")
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function connectDB() {
  if (cached.conn) return cached.conn

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGO_DB_URL, {
      tls: true,
      tlsAllowInvalidCertificates: false,
    })
  }

  cached.conn = await cached.promise
  return cached.conn
}

export default connectDB
