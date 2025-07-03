import mongoose from "mongoose";

const DatoSensorSchema = new mongoose.Schema({
  cultivo: { type: String, enum: ["tomates", "lechugas"], required: true },
  humedadSuelo: Number,
  temperaturaSuelo: Number,
  timestamp: String,
});

export const DatoSensor = mongoose.model("DatoSensor", DatoSensorSchema);
