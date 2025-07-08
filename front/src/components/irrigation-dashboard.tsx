"use client"
//@ts-nocheck

import type React from "react"

import {
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  ComposedChart,
  Legend,
  ReferenceLine,
  Tooltip,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {  Cloud } from "lucide-react"
import PredictionCards from "./prediction-cards"

// Datos meteorológicos completos


// Transformar todos los datos para el gráfico
const parseWeatherData = (fullWeatherData) => {
  const { hourly } = fullWeatherData
  return hourly.time.map((time, index) => {
    const date = new Date(time)
    const day = date.getDate()
    const month = date.toLocaleDateString("es-ES", { month: "short" })
    const hour = date.getHours()

    return {
      time,
      displayTime: hour === 0 ? `${day} ${month}` : hour === 12 ? "12:00" : "",
      fullTime: `${day} ${month} ${hour.toString().padStart(2, "0")}:00`,
      temperature: hourly.temperature_2m[index],
      humidity: hourly.relative_humidity_2m[index],
      precipitationProb: hourly.precipitation_probability[index],
      precipitation: hourly.precipitation[index] * 20, // Escalar para visualización
      showers: hourly.showers[index] * 20,
      day,
      hour,
    }
  })
}

// Tooltip personalizado
const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload || !payload.length) return null
  const data = payload[0].payload
  return (
    <div className="bg-white p-3 border border-gray-300 rounded-lg shadow-lg text-xs">
      <p className="font-semibold mb-2">{data.fullTime}</p>
      <div className="space-y-1">
        <p className="flex items-center gap-2">
          <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
          <span>Temperatura: {data.temperature}°C</span>
        </p>
        <p className="flex items-center gap-2">
          <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
          <span>Humedad: {data.humidity}%</span>
        </p>
        <p className="flex items-center gap-2">
          <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
          <span>Prob. lluvia: {data.precipitationProb}%</span>
        </p>
        {data.precipitation > 0 && (
          <p className="flex items-center gap-2">
            <span className="w-3 h-3 bg-cyan-500 rounded-full"></span>
            <span>Precipitación: {(data.precipitation / 20).toFixed(1)}mm</span>
          </p>
        )}
      </div>
    </div>
  )
}


export default function IrrigationDashboard({ fullWeatherData }: { fullWeatherData: Record<string, any> }) {
  console.log("Full Weather Data:", fullWeatherData)
  const chartData = parseWeatherData(fullWeatherData)
  console.log("Chart Data:", chartData.slice(0, 5)) // Muestra los primeros 5 datos para depuración


  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Sistema de Riego Inteligente</h1>
          <p className="text-gray-600">
            {fullWeatherData.latitude.toFixed(2)}°N {fullWeatherData.longitude.toFixed(2)}°E • 44m sobre el nivel del
            mar
          </p>
          <p className="text-sm text-gray-500">Generado en 0.28ms, tiempo en GMT+0</p>
        </div>

        {/* Gráfico Meteorológico Completo - Mitad Superior */}
        <Card className="h-[500px]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="w-5 h-5" />
              Datos Meteorológicos Detallados - 7 Días (168 horas)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={400}>
              <ComposedChart data={chartData} margin={{ top: 20, right: 80, left: 20, bottom: 60 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />

                {/* Eje X */}
                <XAxis
                  dataKey="displayTime"
                  tick={{ fontSize: 10 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                  interval={0}
                />

                {/* Ejes Y múltiples */}
                <YAxis
                  yAxisId="temp"
                  orientation="left"
                  domain={[15, 35]}
                  tick={{ fontSize: 10 }}
                  label={{ value: "°C", angle: -90, position: "insideLeft" }}
                />
                <YAxis
                  yAxisId="percent"
                  orientation="right"
                  domain={[0, 100]}
                  tick={{ fontSize: 10 }}
                  label={{ value: "%", angle: 90, position: "insideRight" }}
                />
                {/* <YAxis
                  yAxisId="precip"
                  orientation="right"
                  domain={[0, 50]}
                  tick={{ fontSize: 2 }}
                  dx={40}
                  label={{ value: "mm", angle: 90, position: "outsideRight" }}
                /> */}

                {/* Tooltip personalizado */}
                {/* <CustomTooltip  payload={chartData}/> */}
                <Tooltip content={<CustomTooltip />} />


                {/* Líneas de referencia */}
                <ReferenceLine yAxisId="temp" y={25} stroke="#ddd" strokeDasharray="2 2" />

                {/* Barras de precipitación */}
                <Bar yAxisId="precip" dataKey="precipitation" fill="#22d3ee" opacity={0.6} name="Precipitación" />
                <Bar yAxisId="precip" dataKey="showers" fill="#06b6d4" opacity={0.8} name="Chubascos" />

                {/* Líneas meteorológicas */}
                <Line
                  yAxisId="temp"
                  type="monotone"
                  dataKey="temperature"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                  name="Temperatura 2m"
                />
                <Line
                  yAxisId="temp"
                  type="monotone"
                  dataKey="showers"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={false}
                  name="Sensación térmica"
                />
                <Line
                  yAxisId="percent"
                  type="monotone"
                  dataKey="humidity"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={false}
                  name="Humedad relativa 2m"
                />
                <Line
                  yAxisId="percent"
                  type="monotone"
                  dataKey="precipitationProb"
                  stroke="#f59e0b"
                  strokeWidth={2}
                  dot={false}
                  name="Probabilidad precipitación"
                />
                <Line
                  yAxisId="percent"
                  type="monotone"
                  dataKey="precipitation"
                  stroke="#000"
                  strokeWidth={2}
                  dot={false}
                  name="Cantidad precipitación (mm * 20)"
                />

                {/* Leyenda personalizada */}
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="line"
                  wrapperStyle={{ fontSize: "12px", paddingTop: "10px" }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

   
      </div>
      <PredictionCards />
    </div>
  )
}
