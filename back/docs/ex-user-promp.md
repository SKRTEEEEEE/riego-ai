```ts
const USER_PROMPT = `
A partir de los siguientes datos:

- Datos históricos diarios y semanales (mediaDiaria, mediaSemanal)
- Datos meteorológicos por hora (datosMeteoPorHora) desde Open-Meteo
- Parámetro de calidad del agua (phAguaPrevio)

Calcula una recomendación diaria de fertirrigación para los próximos 7 días, optimizando los siguientes aspectos:

- Selecciona horas con menor evaporación y baja radiación solar, evitando lluvia
- Ajusta el riego si se prevé lluvia o la humedad histórica es alta
- Corrige el pH si está fuera del rango ideal (5.5 – 6.5)
- Calcula el tiempo de mezcla de nutrientes en milisegundos
- Usa el volumen total del depósito (500L) para calcular dosis totales a inyectar
- Usa los valores típicos indicados en el sistema si no se dan dosis exactas

### Entrada de ejemplo:

{
  "phAguaPrevio": 7.4,
  "mediaDiaria": [
    { "dia": "2025-07-04", "humedadMedia": 65.9, "temperaturaMedia": 23.9 }
  ],
  "mediaSemanal": [
    { "semana": "2025-06-27 - 2025-07-03", "humedadMedia": 66.1, "temperaturaMedia": 24.0 }
  ],
  "datosMeteoPorHora": [
    {
      "fecha": "2025-07-09T04:00",
      "temperatura": 22.1,
      "humedad": 70,
      "probLluvia": 0,
      "lluvia": 0,
      "sol": 0
    },
    {
      "fecha": "2025-07-09T15:00",
      "temperatura": 32.5,
      "humedad": 45,
      "probLluvia": 20,
      "lluvia": 0.1,
      "sol": 60
    }
  ]
}
`;

```