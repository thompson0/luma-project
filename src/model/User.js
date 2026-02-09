import { Schema, model, models } from "mongoose"

const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, "nome é obrigatório"]
  },
  email: {
    type: String,
    required: [true, "email é obrigatório"],
    unique: true
  },
  senha:{
    type:String,
    required: [true, "senha é obrigatório"]
  },
  role: {
    type: String,
    required: [true, "cargo é obrigatório"]
  }
})

export default models.User || model("User", UserSchema)
