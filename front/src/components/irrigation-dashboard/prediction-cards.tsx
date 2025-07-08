"use client"

import { useState } from "react"
import { Droplets, CheckCircle, Zap, Settings, BrainCircuit, Send, Cog } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { predictionData } from "./temp"


const systemConfig = {
  volumenMaxDepositoMezcla: 100000,
  caudalesNutrientes: {
    reguladorPH: 10, // L/h
    nitrogeno: 10, // L/h
    fosforo: 1, // L/h
    potasio: 1, // L/h
  },
  rangoPhIdeal: [5.5, 6],
  phAguaPrevio: 7.1,
  cultivo: "tomates",
}

const dayNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]

function formatTime(ms: string): string {
  const hours = Math.floor(Number.parseInt(ms) / 3600000)
  const minutes = Math.floor((Number.parseInt(ms) % 3600000) / 60000)
  return `${hours}h ${minutes}m`
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

function formatShortDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString("es-ES", {
    weekday: "short",
    day: "numeric",
    month: "short",
  })
}

// Función para calcular el caudal de salida basado en cantidad de riego (para 2 horas)
function calculateCaudalSalida(cantidadRiego: string, areaHectareas = 1): string {
  const riegoMmDia = Number.parseFloat(cantidadRiego)
  if (isNaN(riegoMmDia)) return "0.0 bar"

  // Convertir mm/día a litros por hectárea por hora (para 2 horas de riego)
  // 1 mm = 10,000 L/ha
  const litrosPorHectarea = riegoMmDia * 10000
  const litrosPorHora = litrosPorHectarea / 2 // Para 2 horas de riego

  // Convertir a presión aproximada (fórmula simplificada)
  // Asumiendo que 1 bar ≈ 20,000 L/ha/h
  const presionBar = litrosPorHora / 20000

  return `${presionBar.toFixed(1)} bar`
}

// Función para calcular el volumen total aproximado
function calculateVolumenTotal(cantidadRiego: string, areaHectareas = 1): string {
  const riegoMmDia = Number.parseFloat(cantidadRiego)
  if (isNaN(riegoMmDia)) return "0"

  // 1 mm de riego = 10,000 L/ha
  const volumenLitros = riegoMmDia * 10000 * areaHectareas

  return volumenLitros.toLocaleString()
}

export default function PredictionCards() {
  const [editableData, setEditableData] = useState(predictionData)
  const dates = Object.keys(editableData)

  const updateData = (currentDate: string, field: string, value: string, subField?: string) => {
    setEditableData((prev) => {
      const newData = {
        ...prev,
        [currentDate]: {
          ...prev[currentDate],
          [field]: subField
            ? {
                ...prev[currentDate][field],
                [subField]: value,
              }
            : value,
        },
      }

      // Si se cambió la cantidad de riego, recalcular el caudal de salida
      if (field === "cantidadRiego") {
        newData[currentDate].caudalSalidaRiego = calculateCaudalSalida(value)
      }

      return newData
    })
  }

  // Función para manejar el envío de datos
  const handleApplyChanges = () => {
    console.log("Aplicando cambios:", editableData)
    // Aquí puedes añadir la lógica para enviar los datos al backend
    alert("Cambios aplicados correctamente!")
  }

  // Función para abrir configuración
  const handleOpenSettings = () => {
    console.log("Abriendo configuración...")
    // Aquí puedes añadir la lógica para abrir el modal de configuración
    alert("Configuración - Próximamente")
  }

  const renderDayContent = (currentDate: string) => {
    const currentData = editableData[currentDate]

    return (
      <div className="space-y-6">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-blue-600" />
            <h3>
              Configuración de Riego - <span className="font-semibold text-lg">{formatDate(currentDate)}</span>
            </h3>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Tiempos de Salida - Editable */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center">
                <Droplets className="h-4 w-4 mr-2 text-blue-500" />
                Tiempos de Salida (Editables)
              </h4>
              <div className="space-y-3">
                <div>
                  <Label htmlFor={`ph-${currentDate}`}>Regulador pH</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id={`ph-${currentDate}`}
                      value={currentData.tiempoSalidaMezclaReguladorPH}
                      onChange={(e) => updateData(currentDate, "tiempoSalidaMezclaReguladorPH", e.target.value)}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-500 min-w-[60px]">
                      {formatTime(currentData.tiempoSalidaMezclaReguladorPH)}
                    </span>
                  </div>
                </div>
                <div>
                  <Label htmlFor={`nitrogen-${currentDate}`}>Nitrógeno</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id={`nitrogen-${currentDate}`}
                      value={currentData.tiempoSalidaMezclaNitrogeno}
                      onChange={(e) => updateData(currentDate, "tiempoSalidaMezclaNitrogeno", e.target.value)}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-500 min-w-[60px]">
                      {formatTime(currentData.tiempoSalidaMezclaNitrogeno)}
                    </span>
                  </div>
                </div>
                <div>
                  <Label htmlFor={`phosphorus-${currentDate}`}>Fósforo</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id={`phosphorus-${currentDate}`}
                      value={currentData.tiempoSalidaMezclaFosforo}
                      onChange={(e) => updateData(currentDate, "tiempoSalidaMezclaFosforo", e.target.value)}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-500 min-w-[60px]">
                      {formatTime(currentData.tiempoSalidaMezclaFosforo)}
                    </span>
                  </div>
                </div>
                <div>
                  <Label htmlFor={`potassium-${currentDate}`}>Potasio</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id={`potassium-${currentDate}`}
                      value={currentData.tiempoSalidaMezclaPotasio}
                      onChange={(e) => updateData(currentDate, "tiempoSalidaMezclaPotasio", e.target.value)}
                      className="flex-1"
                    />
                    <span className="text-sm text-gray-500 min-w-[60px]">
                      {formatTime(currentData.tiempoSalidaMezclaPotasio)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* Información de Riego */}
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900 flex items-center">
                <Zap className="h-4 w-4 mr-2 text-green-500" />
                Información de Riego
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium">Caudal de Salida:</span>
                  <span className="text-sm font-bold text-blue-600">{currentData.caudalSalidaRiego}</span>
                </div>

                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Cantidad de Riego:</span>
                    <span className="text-sm font-bold text-green-600">{currentData.cantidadRiego} mm/día</span>
                  </div>
                  <Input
                    value={currentData.cantidadRiego}
                    onChange={(e) => updateData(currentDate, "cantidadRiego", e.target.value)}
                    className="mt-2"
                    placeholder="Cantidad de riego (mm/día)"
                    type="number"
                    step="0.1"
                  />
                </div>

                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span className="text-sm font-medium">Regulador pH:</span>
                  <span className="text-sm font-bold text-purple-600">{currentData.cantidadReguladorPH} L/ha</span>
                </div>

                <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                  <span className="text-sm font-medium">Volumen Total Aproximado:</span>
                  <span className="text-sm font-bold text-yellow-600">
                    {calculateVolumenTotal(currentData.cantidadRiego)} L
                  </span>
                </div>

                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium mb-2">Horario de Riego:</div>
                  <div className="text-sm text-gray-600">
                    <div>Día: {dayNames[Number.parseInt(currentData.tiempoRiego.dia)]}</div>
                    <div>
                      Hora: {currentData.tiempoRiego.horaInicio}:00 - {currentData.tiempoRiego.horaFin}:00
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Nutrientes */}
          <div className="mt-6">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
              Cantidad de Nutrientes (kg/ha)
            </h4>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{currentData.cantidadNutrientes.nitrógeno}</div>
                <div className="text-sm text-gray-600">Nitrógeno</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">{currentData.cantidadNutrientes.fósforo}</div>
                <div className="text-sm text-gray-600">Fósforo</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{currentData.cantidadNutrientes.potasio}</div>
                <div className="text-sm text-gray-600">Potasio</div>
              </div>
            </div>
          </div>
          {/* Configuración del Sistema */}
          <div className="border-t pt-4 mt-6">
            <h4 className="font-semibold text-gray-900 mb-3">Configuración del Sistema</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="p-2 bg-gray-50 rounded">
                <div className="font-medium">Volumen Máximo</div>
                <div className="text-gray-600">{systemConfig.volumenMaxDepositoMezcla.toLocaleString()} L</div>
              </div>
              <div className="p-2 bg-gray-50 rounded">
                <div className="font-medium">pH Ideal</div>
                <div className="text-gray-600">
                  {systemConfig.rangoPhIdeal[0]} - {systemConfig.rangoPhIdeal[1]}
                </div>
              </div>
              <div className="p-2 bg-gray-50 rounded">
                <div className="font-medium">pH Agua Previo</div>
                <div className="text-gray-600">{systemConfig.phAguaPrevio}</div>
              </div>
              <div className="p-2 bg-gray-50 rounded">
                <div className="font-medium">Cultivo</div>
                <div className="text-gray-600 capitalize">{systemConfig.cultivo}</div>
              </div>
            </div>
          </div>
        </CardContent>
      </div>
    )
  }

  return (
    <Collapsible defaultOpen={true}>
      <Card>
        <CollapsibleTrigger className="flex items-center justify-between w-full px-6">
          <CardTitle className="flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-blue-600" />
            <span className="font-semibold text-lg">Predicciones y Recomendaciones de IA</span>
          </CardTitle>
          <div className="flex items-center gap-2">
            <span onClick={handleApplyChanges}  className="w-fit flex gap-4 rounded-xl p-2 items-center bg-green-600 hover:bg-green-700 text-white">
              <Send className="h-4 w-4 mr-1" />
              Aplicar en la PLC
            </span>
            <span onClick={handleOpenSettings} className="bg-gray-200  hover:bg-gray-300 text-gray-800 cursor-pointer rounded-full px-4 py-2">
              <Cog className="h-6 w-6" />
            </span>
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-4">
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <Tabs defaultValue={dates[0]} className="w-full">
              <TabsList className="grid w-full grid-cols-7 mb-6">
                {dates.map((date) => (
                  <TabsTrigger
                    key={date}
                    value={date}
                    className="text-xs px-2 py-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                  >
                    <div className="text-center">
                      <div className="font-medium">{formatShortDate(date)}</div>
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>

              {dates.map((date) => (
                <TabsContent key={date} value={date} className="mt-0">
                  {renderDayContent(date)}
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  )
}
