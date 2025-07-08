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
import { Cloud } from "lucide-react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "../ui/collapsible"

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

export default function WeatherChart({ chartData }: { chartData: Record<string, any>[] }) {

  {/* Gráfico Meteorológico Completo - Mitad Superior */ }
  return (

    <Collapsible>
      <Card >
        <CollapsibleTrigger>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cloud className="w-5 h-5" />
            Datos Meteorológicos Detallados - 7 Días (168 horas)
          </CardTitle>
        </CardHeader>
        </CollapsibleTrigger>
        <CollapsibleContent>
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

              {/* Tooltip personalizado */}
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
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}