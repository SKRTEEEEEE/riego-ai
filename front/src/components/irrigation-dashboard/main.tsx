"use client"
//@ts-nocheck

import type React from "react"


import WeatherChart from "./weather-chart"
// import TalkAICard from "./talkai-card"
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



export default function IrrigationDashboard({ fullWeatherData, plcStatus, aiData }: 
    { 
    fullWeatherData: Record<string, any>, 
    plcStatus: Record<string, any>, 
    aiData: Record<string, any>,
}) {
    const chartData = parseWeatherData(fullWeatherData)


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
                <WeatherChart chartData={chartData} />
                {/* Predicciones de IA - Mitad Inferior */}
                <PredictionCards plcStatus={plcStatus} aiData={aiData}/>
                {/* Talk AI - Footer */}
                {/* <TalkAICard /> */}
            </div>

        </div>
    )
}
