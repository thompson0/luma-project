import { betterAuth } from "better-auth"
import { mongooseAdapter } from "better-auth/adapters/mongoose"
import connectDB from "@/lib/dbConnect"
import mongoose from "mongoose"

await connectDB()

export const auth = betterAuth({
  database: mongooseAdapter(mongoose.connection),

  emailAndPassword: {
    enabled: true
  },

  user: {
    additionalFields: {
      role: {
        type: "string",
        required: true,
        defaultValue: "user"
      }
    }
  },

  secret: process.env.BETTER_AUTH_SECRET
})
