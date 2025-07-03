interface DatosSalidaServer {
    phAguaPrevio: number; // pH del agua del tanque previo
    caudalSalidaRiego: number; // Caudal de salida para riego (L/min)
    tiempoRiego: {
        hora: number; // Hora del riego (0-23)
        dia: number; // Día de la semana (0-6, donde 0 es domingo)
    };
    tiempoSalidaMezclaReguladorPH: number; // Tiempo de salida mezcla regulador pH (ms)
    tiempoSalidaMezclaNitrogeno: number; // Tiempo de salida mezcla nitrógeno (ms)
    tiempoSalidaMezclaFosforo: number; // Tiempo de salida mezcla fósforo (ms)
    tiempoSalidaMezclaPotasio: number; // Tiempo de salida mezcla potasio (ms)
}



const datosSalidaEjemplo1: DatosSalidaServer = {
    phAguaPrevio: 6.5,
    caudalSalidaRiego: 10,
    tiempoRiego: {
        hora: 6,
        dia: 2 // Martes
    },
    tiempoSalidaMezclaReguladorPH: 300,
    tiempoSalidaMezclaNitrogeno: 4500,
    tiempoSalidaMezclaFosforo: 1000,
    tiempoSalidaMezclaPotasio: 3000
};

const datosSalidaEjemplo2: DatosSalidaServer = {
    phAguaPrevio: 7.0,
    caudalSalidaRiego: 15,
    tiempoRiego: {
        hora: 18,
        dia: 5 // Viernes
    },
    tiempoSalidaMezclaReguladorPH: 2500,
    tiempoSalidaMezclaNitrogeno: 6000,
    tiempoSalidaMezclaFosforo: 550,
    tiempoSalidaMezclaPotasio: 7000
};

const datosSalidaEjemplo3: DatosSalidaServer = {
    phAguaPrevio: 5.8,
    caudalSalidaRiego: 12,
    tiempoRiego: {
        hora: 8,
        dia: 0 // Domingo
    },
    tiempoSalidaMezclaReguladorPH: 2000,
    tiempoSalidaMezclaNitrogeno: 3000,
    tiempoSalidaMezclaFosforo: 1500,
    tiempoSalidaMezclaPotasio: 4000
};

const datosSalidaEjemplo4: DatosSalidaServer = {
    phAguaPrevio: 6.2,
    caudalSalidaRiego: 8,
    tiempoRiego: {
        hora: 14,
        dia: 3 // Jueves
    },
    tiempoSalidaMezclaReguladorPH: 3500,
    tiempoSalidaMezclaNitrogeno: 5000,
    tiempoSalidaMezclaFosforo: 4500,
    tiempoSalidaMezclaPotasio: 550
};
