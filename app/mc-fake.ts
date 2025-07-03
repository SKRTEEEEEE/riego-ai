type Cultivo = "tomates" | "lechugas";

interface Rango {
  humedad: [number, number];
  temperatura: [number, number];
}

interface DatosSensor {
  cultivo: Cultivo;
  humedadSuelo: number;      // porcentaje
  temperaturaSuelo: number;  // grados Celsius
  timestamp: string;         // fecha ISO
}

const rangos: Record<Cultivo, Rango> = {
  lechugas: {
    humedad: [70, 80],
    temperatura: [10, 20],
  },
  tomates: {
    humedad: [60, 70],
    temperatura: [18, 25],
  },
};

function getValorDistribuido(rango: [number, number], tipo: "humedad" | "temperatura"): number {
  const prob = Math.random();

  let min = rango[0];
  let max = rango[1];
  let valor = 0;

  if (prob <= 0.75) {
    // Dentro del rango normal
    valor = Math.random() * (max - min) + min;
  } else if (prob <= 0.90) {
    // Leve desviación
    const desviacion = tipo === "humedad" ? 5 : 2;
    min -= desviacion;
    max += desviacion;
    valor = Math.random() * (max - min) + min;
  } else {
    // Mayor desviación
    const desviacion = tipo === "humedad" ? 15 : 5;
    min -= desviacion;
    max += desviacion;
    valor = Math.random() * (max - min) + min;
  }

  return parseFloat(valor.toFixed(1));
}

export function generarDatoMC(cultivo: Cultivo): DatosSensor {
  const rango = rangos[cultivo];

  const humedad = getValorDistribuido(rango.humedad, "humedad");
  const temperatura = getValorDistribuido(rango.temperatura, "temperatura");

  return {
    cultivo,
    humedadSuelo: Math.min(Math.max(humedad, 0), 100), // entre 0 y 100
    temperaturaSuelo: parseFloat(temperatura.toFixed(1)),
    timestamp: new Date().toISOString(),
  };
}
