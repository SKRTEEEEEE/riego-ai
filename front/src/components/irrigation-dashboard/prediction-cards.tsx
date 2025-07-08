import { Droplets, Thermometer, Cloud, Sun, AlertTriangle, CheckCircle, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"


// Predicciones simuladas de IA
const aiPredictions = [
  {
    id: 1,
    title: "Riego Recomendado - Zona A",
    description: "Regar 15 minutos a las 06:00. Humedad del suelo: 45%",
    status: "recommended",
    confidence: 92,
    icon: <Droplets className="w-4 h-4" />,
  },
  {
    id: 2,
    title: "Alerta de Temperatura",
    description: "Temperatura alta esperada (29°C). Considerar riego adicional.",
    status: "warning",
    confidence: 87,
    icon: <Thermometer className="w-4 h-4" />,
  },
  {
    id: 3,
    title: "Probabilidad de Lluvia",
    description: "40% probabilidad de lluvia mañana. Reducir riego programado.",
    status: "info",
    confidence: 78,
    icon: <Cloud className="w-4 h-4" />,
  },
  {
    id: 4,
    title: "Condiciones Óptimas - Zona B",
    description: "Condiciones ideales para el crecimiento. Mantener programa actual.",
    status: "success",
    confidence: 95,
    icon: <CheckCircle className="w-4 h-4" />,
  },
  {
    id: 5,
    title: "Eficiencia Energética",
    description: "Mejor momento para riego: 05:00-07:00 (menor evaporación)",
    status: "info",
    confidence: 89,
    icon: <Sun className="w-4 h-4" />,
  },
  {
    id: 6,
    title: "Mantenimiento Preventivo",
    description: "Revisar sensores de humedad en Zona C. Lecturas inconsistentes.",
    status: "warning",
    confidence: 73,
    icon: <AlertTriangle className="w-4 h-4" />,
  },
  {
    id: 7,
    title: "Optimización Semanal",
    description: "Ahorro de agua proyectado: 23% con el nuevo programa de riego.",
    status: "success",
    confidence: 91,
    icon: <Droplets className="w-4 h-4" />,
  },
]

export default function PredictionCards() {
      const [prompt, setPrompt] = useState("")

      const getStatusColor = (status: string) => {
    switch (status) {
      case "recommended":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "warning":
        return "bg-orange-100 text-orange-800 border-orange-200"
      case "info":
        return "bg-gray-100 text-gray-800 border-gray-200"
      case "success":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Nuevo prompt:", prompt)
    setPrompt("")
  }

    return (
<>
     {/* Predicciones de IA - Mitad Inferior */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Predicciones y Recomendaciones de IA</h2>

          {/* Grid de Predicciones */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {aiPredictions.map((prediction) => (
              <Card key={prediction.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${getStatusColor(prediction.status)}`}>{prediction.icon}</div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm mb-1">{prediction.title}</h3>
                      <p className="text-xs text-gray-600 mb-2">{prediction.description}</p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {prediction.confidence}% confianza
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Input para Nuevo Prompt */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Consulta a la IA</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  value={prompt}
                  onChange={(e: { target: { value: React.SetStateAction<string> } }) => setPrompt(e.target.value)}
                  placeholder="Pregunta sobre riego, clima o optimización del sistema..."
                  className="flex-1"
                />
                <Button type="submit" disabled={!prompt.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </form>
              <p className="text-xs text-gray-500 mt-2">
                Ejemplo: &quot;¿Cuál es el mejor momento para regar mañana?&quot; o &quot;¿Cómo puedo reducir el consumo de agua?&quot;
              </p>
            </CardContent>
          </Card>
        </div>
</>
    )}