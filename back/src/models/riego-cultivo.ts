import mongoose from "mongoose";

const RiegoCultivoSchema = new mongoose.Schema({
    tiempoSalidaMezclaReguladorPH: Number,
    tiempoSalidaMezclaNitrogeno: Number, 
    tiempoSalidaMezclaFosforo: Number,
    tiempoSalidaMezclaPotasio: Number,
    caudalSalidaRiego: String,
    tiempoRiego: {
      horaInicio: Number,
      horaFin: Number, 
      dia: Number
    },
    cantidadReguladorPH: Number,
    cantidadRiego: Number,
    cantidadNutrientes: {
      nitrógeno: Number,
      fósforo: Number,
      potasio: Number
    },
    cultivo: { type: String, enum: ["tomates", "lechugas"], required: true },
})

export const RiegoCultivo = mongoose.model("RiegoCultivo", RiegoCultivoSchema)