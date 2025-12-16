export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString("es-ES", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

export function formatShortDate(dateStr: string): string {
  const date = new Date(dateStr)
  return date.toLocaleDateString("es-ES", {
    weekday: "short",
    day: "numeric",
    month: "short",
  })
}

// Función para calcular el caudal de salida basado en cantidad de riego (para 2 horas)
export function calculateCaudalSalida(cantidadRiego: string, areaHectareas = 1): string {
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
export function calculateVolumenTotal(cantidadRiego: string, areaHectareas = 1): string {
  const riegoMmDia = Number.parseFloat(cantidadRiego)
  if (isNaN(riegoMmDia)) return "0"

  // 1 mm de riego = 10,000 L/ha
  const volumenLitros = riegoMmDia * 10000 * areaHectareas

  return volumenLitros.toLocaleString()
}

// Función para formatear tiempo en minutos y segundos
export function formatTimeMinSec(ms: string): string {
  const totalSeconds = Math.floor(Number.parseInt(ms) / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${minutes}m ${seconds}s`
}

export const systemConfig = {
  volumenMaxDepositoMezcla: 100000,
  caudalesNutrientes: {
    reguladorPH: 10, // L/h
    nitrogeno: 10, // L/h
    fosforo: 1, // L/h
    potasio: 1, // L/h
  },
  concentracionNutrientes: {
    nitrogeno: 0.5, // Kg/L
    fosforo: 0.5, // Kg/L
    potasio: 0.5, // Kg/L
  },
  rangoPhIdeal: [5.5, 6],
  phAguaPrevio: 7.1,
  cultivo: "tomates",
}

export const dayNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"]

