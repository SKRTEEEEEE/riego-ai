export type Cultivo = "tomates" | "lechugas";

export type EspecificacionesSystemPrompt = {
  volumenMaxDepositoMezcla: number; // Volumen total del depósito de mezcla en litros
  caudalesNutrientes: {
    reguladorPH: number; // Caudal de inyección del regulador de pH en L/h
    nitrogeno: number; // Caudal de inyección de nitrógeno en L/h
    fosforo: number; // Caudal de inyección de fósforo en L/h
    potasio: number; // Caudal de inyección de potasio en L/h
  },
  concentracionNutrientes: {
    nitrogeno: number; // Concentración de nitrógeno en g/L
    fosforo: number; // Concentración de fósforo en g/L
    potasio: number; // Concentración de potasio en g/L
  }
}

export type EspecificacionesUserPrompt = {
  rangoPhIdeal?: [number, number]; // Rango ideal de pH para el agua de riego
  phAguaPrevio: number; // pH del agua de riego previo

  cultivo: Cultivo; // Tipo de cultivo para el que se generan las recomendaciones

}

