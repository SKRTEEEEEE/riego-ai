"use client"

import { useState } from "react"
import { Droplets, CheckCircle, Zap, Settings, BrainCircuit, Send, Cog, X, Check } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { predictionData } from "./temp"
import { calculateCaudalSalida, calculateVolumenTotal, dayNames, formatDate, formatShortDate, formatTimeMinSec, systemConfig } from "./prediction-cards-utils"





export default function PredictionCards({plcStatus, aiData}: { plcStatus: Record<string, any>, aiData: Record<string, any> | null }) {
  console.log("aiData:", aiData)
  
  // Usar datos por defecto si aiData es null
  const defaultData = aiData || {}
  const [editableData, setEditableData] = useState(defaultData)
  const [appliedDates, setAppliedDates] = useState<Set<string>>(new Set()) // Para trackear qué días han sido aplicados
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

    // Marcar como no aplicado cuando se hacen cambios
    setAppliedDates((prev) => {
      const newSet = new Set(prev)
      newSet.delete(currentDate)
      return newSet
    })
  }

  // Función para manejar el envío de datos
  const handleApplyChanges = () => {
    console.log("Aplicando cambios:", editableData)
    // Marcar todas las fechas como aplicadas
    setAppliedDates(new Set(dates))
    alert("Cambios aplicados correctamente!")
  }

  // Función para abrir configuración
  const handleOpenSettings = () => {
    console.log("Abriendo configuración...")
    alert("Configuración - Próximamente...")
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
          {/* Tiempos de Salida - 3 Columnas */}
          <div className="space-y-4">
            <h4 className="font-semibold text-gray-900 flex items-center">
              <Droplets className="h-4 w-4 mr-2 text-blue-500" />
              Tiempos de Salida (Editables)
            </h4>

            {/* Headers de las columnas */}
            <div className="grid grid-cols-4 gap-4 text-sm font-medium text-gray-600 border-b pb-2">
              <div>Nutriente</div>
              <div>Concentración</div>
              <div>Caudal Inyección</div>
              <div>Tiempo (ms / min:seg)</div>
            </div>

            {/* Regulador pH */}
            <div className="grid grid-cols-4 gap-4 items-center py-2 border-b border-gray-100">
              <div className="font-medium">Regulador pH</div>
              <div className="text-sm text-gray-600">{currentData.cantidadReguladorPH} L/ha</div>
              <div className="text-sm text-gray-600">{systemConfig.caudalesNutrientes.reguladorPH} L/h</div>
              <div className="space-y-1">
                <Input
                  value={currentData.tiempoSalidaMezclaReguladorPH}
                  onChange={(e) => updateData(currentDate, "tiempoSalidaMezclaReguladorPH", e.target.value)}
                  className="text-sm"
                  placeholder="Tiempo en ms"
                />
                <div className="text-xs text-gray-500">
                  {formatTimeMinSec(currentData.tiempoSalidaMezclaReguladorPH)}
                </div>
              </div>
            </div>

            {/* Nitrógeno */}
            <div className="grid grid-cols-4 gap-4 items-center py-2 border-b border-gray-100">
              <div className="font-medium">Nitrógeno</div>
              <div className="text-sm text-gray-600">{systemConfig.concentracionNutrientes.nitrogeno} Kg/L</div>
              <div className="text-sm text-gray-600">{systemConfig.caudalesNutrientes.nitrogeno} L/h</div>
              <div className="space-y-1">
                <Input
                  value={currentData.tiempoSalidaMezclaNitrogeno}
                  onChange={(e) => updateData(currentDate, "tiempoSalidaMezclaNitrogeno", e.target.value)}
                  className="text-sm"
                  placeholder="Tiempo en ms"
                />
                <div className="text-xs text-gray-500">{formatTimeMinSec(currentData.tiempoSalidaMezclaNitrogeno)}</div>
              </div>
            </div>

            {/* Fósforo */}
            <div className="grid grid-cols-4 gap-4 items-center py-2 border-b border-gray-100">
              <div className="font-medium">Fósforo</div>
              <div className="text-sm text-gray-600">{systemConfig.concentracionNutrientes.fosforo} Kg/L</div>
              <div className="text-sm text-gray-600">{systemConfig.caudalesNutrientes.fosforo} L/h</div>
              <div className="space-y-1">
                <Input
                  value={currentData.tiempoSalidaMezclaFosforo}
                  onChange={(e) => updateData(currentDate, "tiempoSalidaMezclaFosforo", e.target.value)}
                  className="text-sm"
                  placeholder="Tiempo en ms"
                />
                <div className="text-xs text-gray-500">{formatTimeMinSec(currentData.tiempoSalidaMezclaFosforo)}</div>
              </div>
            </div>

            {/* Potasio */}
            <div className="grid grid-cols-4 gap-4 items-center py-2">
              <div className="font-medium">Potasio</div>
              <div className="text-sm text-gray-600">{systemConfig.concentracionNutrientes.potasio} Kg/L</div>
              <div className="text-sm text-gray-600">{systemConfig.caudalesNutrientes.potasio} L/h</div>
              <div className="space-y-1">
                <Input
                  value={currentData.tiempoSalidaMezclaPotasio}
                  onChange={(e) => updateData(currentDate, "tiempoSalidaMezclaPotasio", e.target.value)}
                  className="text-sm"
                  placeholder="Tiempo en ms"
                />
                <div className="text-xs text-gray-500">{formatTimeMinSec(currentData.tiempoSalidaMezclaPotasio)}</div>
              </div>
            </div>
          </div>

          {/* Información de Riego */}
          <div className="mt-8 space-y-4">
            <h4 className="font-semibold text-gray-900 flex items-center">
              <Zap className="h-4 w-4 mr-2 text-green-500" />
              Información de Riego
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

  // Mostrar mensaje de carga si no hay datos
  if (!aiData || dates.length === 0) {
    return (
      <Card className="border-yellow-200 bg-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-800">
            <BrainCircuit className="h-5 w-5 text-yellow-600" />
            <span className="font-semibold text-lg">Predicciones de IA</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="text-yellow-700">
          <p>Cargando predicciones de IA... Si esta pantalla no cambia, verifica que el backend esté levantado en http://localhost:4321</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Collapsible defaultOpen={true}>
      <Card>
        <CollapsibleTrigger className="flex flex-col w-full px-6">
          <div className="flex items-center justify-between w-full ">
            <CardTitle className="flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-blue-600" />
            <span className="font-semibold text-lg">Predicciones y Recomendaciones de IA</span>
          </CardTitle>
          <div className="flex items-center gap-2">
            <span onClick={handleApplyChanges}  className={"w-fit flex gap-4 rounded-xl p-2 items-center text-white bg-green-600 hover:bg-green-700"}>
              <Send className="h-4 w-4 mr-1" />
              Aplicar Configuración
            </span>
            <span onClick={handleOpenSettings} className="bg-gray-200  hover:bg-gray-300 text-gray-800 cursor-pointer rounded-full px-4 py-2">
              <Cog className="h-6 w-6" />
            </span>
          </div>
          </div>
          <div className={"flex w-full items-center mt-2 justify-end"}>
            <p className={"text-sm p-2 rounded-xl "+ (plcStatus.status ? " bg-blue-600 hover:bg-blue-700" : " bg-red-200 cursor-not-allowed")}>PLC {plcStatus.status?"Conectada":"Desconectada"} - IP: 10.20.30.70</p>

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
                    className="text-xs px-2 py-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white relative"
                  >
                    <div className="text-center">
                      <div className="font-medium">{formatShortDate(date)}</div>
                      <div className="absolute -top-1 -right-1">
                        {appliedDates.has(date) ? (
                          <Check className="h-3 w-3 text-green-600 bg-white rounded-full p-0.5" />
                        ) : (
                          <X className="h-3 w-3 text-red-600 bg-white rounded-full p-0.5" />
                        )}
                      </div>
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
