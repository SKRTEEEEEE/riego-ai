import { EspecificacionesSystemPrompt } from "./ai-pred";

export const getSystemContext = (esp: EspecificacionesSystemPrompt) => `
Eres un ingeniero agrónomo especializado en sistemas de riego automatizado y fertirrigación. Tu función es analizar datos históricos, condiciones climáticas actuales y características del cultivo para generar recomendaciones precisas de riego.

CONOCIMIENTO TÉCNICO:
- Dominas el cálculo de evapotranspiración (ET0) y coeficientes de cultivo (Kc)
- Entiendes los requerimientos nutricionales específicos por tipo de cultivo
- Conoces los rangos óptimos de pH para diferentes cultivos
- Manejas sistemas de fertirrigación automatizada con control de caudal, tiempo y mezcla de nutrientes

SISTEMA TÉCNICO:
- El sistema dispone de un depósito de mezcla máximo de ${esp.volumenMaxDepositoMezcla}L
- Los caudales de inyección de nutrientes son:
  - Regulador de pH: ${esp.caudalesNutrientes.reguladorPH} L/h
  - Nitrógeno: ${esp.caudalesNutrientes.nitrogeno} L/h
  - Fósforo: ${esp.caudalesNutrientes.fosforo} L/h
  - Potasio: ${esp.caudalesNutrientes.potasio} L/h
- La concentración de nutrientes en la mezcla es:
  - Nitrógeno: ${esp.concentracionNutrientes.nitrogeno} Kg/L
  - Fósforo: ${esp.concentracionNutrientes.fosforo} Kg/L
  - Potasio: ${esp.concentracionNutrientes.potasio} Kg/L

OBJETIVOS PRINCIPALES:
1. Calcular el tiempo de inyección de cada nutriente, en mili segundos, para mantener el pH óptimo y los niveles nutricionales adecuados para el tipo de cultivo que te indicara el objetivo. Para ello, debes considerar:
- La cantidad de nutrientes necesarios para el tipo de cultivo
- La concentración de nutrientes en la mezcla
- El volumen de mezcla disponible en el depósito
- Los caudales de inyección de cada nutriente
2. Determinar el caudal de salida de riego necesario para aplicar la cantidad adecuada de agua y nutrientes, considerando:
- La cantidad de tiempo y el momento de el dia, para obtener un riego ideal
- La cantidad de riego ideal para el cultivo en mm/día
- Calcular el caudal de salida del sistema necesaria para alcanzar la cantidad de riego en el tiempo ideales.
3. Determinar el tiempo de inyección de Regulador de pH necesario, considerando:
- El pH del agua de riego previo
- El rango ideal de pH para el cultivo el cual indicara el usuario
- La cantidad de regulador de pH necesaria para ajustar el pH al rango ideal
4. Atender las especificaciones del usuario, teniendo en cuenta los objetivos anteriores.


FORMATO DE RESPUESTA REQUERIDO:
Siempre respondes en formato JSON con la siguiente estructura para los 7 días siguientes al actual:
{
  "[fecha YYYY-MM-DD]": {
    "tiempoSalidaMezclaReguladorPH": "[ms]",
    "tiempoSalidaMezclaNitrogeno": "[ms]", 
    "tiempoSalidaMezclaFosforo": "[ms]",
    "tiempoSalidaMezclaPotasio": "[ms]",
    "caudalSalidaRiego": "[presión]",
    "tiempoRiego": {
      "horaInicio": "[0-23]",
      "horaFin": "[0-23]", 
      "dia": "[0-6]"
    },
    "cantidadReguladorPH": "[L/ha]",
    "cantidadRiego": "[mm/día]",
    "cantidadNutrientes": {
      "nitrógeno": "[kg/ha]",
      "fósforo": "[kg/ha]",
      "potasio": "[kg/ha]"
    }
  }
}

SOLO proporciona el JSON, sin explicaciones adicionales.
`;

export const mockResponse = {
  "2025-07-10": {
    "tiempoSalidaMezclaReguladorPH": "720000",
    "tiempoSalidaMezclaNitrogeno": "1800000",
    "tiempoSalidaMezclaFosforo": "180000",
    "tiempoSalidaMezclaPotasio": "180000",
    "caudalSalidaRiego": "2.5 bar",
    "tiempoRiego": {
      "horaInicio": "6",
      "horaFin": "8",
      "dia": "3"
    },
    "cantidadReguladorPH": "2.0",
    "cantidadRiego": "6.0",
    "cantidadNutrientes": {
      "nitrógeno": "9.0",
      "fósforo": "0.9",
      "potasio": "0.9"
    }
  },
  "2025-07-11": {
    "tiempoSalidaMezclaReguladorPH": "720000",
    "tiempoSalidaMezclaNitrogeno": "1620000",
    "tiempoSalidaMezclaFosforo": "162000",
    "tiempoSalidaMezclaPotasio": "162000",
    "caudalSalidaRiego": "2.3 bar",
    "tiempoRiego": {
      "horaInicio": "7",
      "horaFin": "9",
      "dia": "4"
    },
    "cantidadReguladorPH": "2.0",
    "cantidadRiego": "5.4",
    "cantidadNutrientes": {
      "nitrógeno": "8.1",
      "fósforo": "0.81",
      "potasio": "0.81"
    }
  },
  "2025-07-12": {
    "tiempoSalidaMezclaReguladorPH": "720000",
    "tiempoSalidaMezclaNitrogeno": "1440000",
    "tiempoSalidaMezclaFosforo": "144000",
    "tiempoSalidaMezclaPotasio": "144000",
    "caudalSalidaRiego": "2.1 bar",
    "tiempoRiego": {
      "horaInicio": "6",
      "horaFin": "8",
      "dia": "5"
    },
    "cantidadReguladorPH": "2.0",
    "cantidadRiego": "4.8",
    "cantidadNutrientes": {
      "nitrógeno": "7.2",
      "fósforo": "0.72",
      "potasio": "0.72"
    }
  },
  "2025-07-13": {
    "tiempoSalidaMezclaReguladorPH": "720000",
    "tiempoSalidaMezclaNitrogeno": "1260000",
    "tiempoSalidaMezclaFosforo": "126000",
    "tiempoSalidaMezclaPotasio": "126000",
    "caudalSalidaRiego": "1.9 bar",
    "tiempoRiego": {
      "horaInicio": "7",
      "horaFin": "9",
      "dia": "6"
    },
    "cantidadReguladorPH": "2.0",
    "cantidadRiego": "4.2",
    "cantidadNutrientes": {
      "nitrógeno": "6.3",
      "fósforo": "0.63",
      "potasio": "0.63"
    }
  },
  "2025-07-14": {
    "tiempoSalidaMezclaReguladorPH": "720000",
    "tiempoSalidaMezclaNitrogeno": "1620000",
    "tiempoSalidaMezclaFosforo": "162000",
    "tiempoSalidaMezclaPotasio": "162000",
    "caudalSalidaRiego": "2.3 bar",
    "tiempoRiego": {
      "horaInicio": "6",
      "horaFin": "8",
      "dia": "0"
    },
    "cantidadReguladorPH": "2.0",
    "cantidadRiego": "5.4",
    "cantidadNutrientes": {
      "nitrógeno": "8.1",
      "fósforo": "0.81",
      "potasio": "0.81"
    }
  },
  "2025-07-15": {
    "tiempoSalidaMezclaReguladorPH": "720000",
    "tiempoSalidaMezclaNitrogeno": "1800000",
    "tiempoSalidaMezclaFosforo": "180000",
    "tiempoSalidaMezclaPotasio": "180000",
    "caudalSalidaRiego": "2.5 bar",
    "tiempoRiego": {
      "horaInicio": "7",
      "horaFin": "9",
      "dia": "1"
    },
    "cantidadReguladorPH": "2.0",
    "cantidadRiego": "6.0",
    "cantidadNutrientes": {
      "nitrógeno": "9.0",
      "fósforo": "0.9",
      "potasio": "0.9"
    }
  },
  "2025-07-16": {
    "tiempoSalidaMezclaReguladorPH": "720000",
    "tiempoSalidaMezclaNitrogeno": "1620000",
    "tiempoSalidaMezclaFosforo": "162000",
    "tiempoSalidaMezclaPotasio": "162000",
    "caudalSalidaRiego": "2.3 bar",
    "tiempoRiego": {
      "horaInicio": "6",
      "horaFin": "8",
      "dia": "2"
    },
    "cantidadReguladorPH": "2.0",
    "cantidadRiego": "5.4",
    "cantidadNutrientes": {
      "nitrógeno": "8.1",
      "fósforo": "0.81",
      "potasio": "0.81"
    }
  }
}