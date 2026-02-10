import { Schema, model, models } from "mongoose"

const PecasSchema = new Schema({
  name: {
    type: String,
    required: [true, "nome é obrigatório"],
    unique: true,
    trim: true
  },

  materials: {
    type: String,
    trim: true
  },

  preco: {
    type: Number, 
    min: 0
  },

  fotos: {
    type: [String],
    default: [],
    validate: {
      validator: v => v.length <= 3,
      message: "Cada peça pode ter no máximo 3 fotos"
    }
  }

}, { timestamps: true })

export default models.Pecas || model("Pecas", PecasSchema)
