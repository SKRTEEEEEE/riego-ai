# Datos microcontroladores
## Datos Recomendados para el MVP

**Temperatura y humedad son un excelente punto de partida**, pero te sugiero añadir algunos datos más para maximizar la efectividad:

### Datos Esenciales (MVP):
- **Humedad del suelo** (%)
- **Temperatura del suelo** (°C)
- **Temperatura ambiente** (°C)
- **Humedad relativa del aire** (%)

### Datos Adicionales (fáciles de implementar):
- **Luminosidad/Radiación solar** (lux o W/m²)
- **pH del suelo** (si es factible)

## Ubicación Óptima de los Sensores

**Te recomiendo una estrategia híbrida:**

### 1. **Sensores en el Suelo** (Prioritarios):
- **Humedad del suelo**: Sonda a 10-15cm de profundidad
- **Temperatura del suelo**: Misma profundidad que humedad
- **Ventajas**: Datos directos de la zona radicular, más precisos para decisiones de riego

### 2. **Sensores Ambientales** (Complementarios):
- **Temperatura y humedad del aire**: A 1-2 metros de altura
- **Luminosidad**: Sensor orientado hacia el cielo
- **Ventajas**: Contexto ambiental, correlación con evapotranspiración

## Justificación Técnica

**¿Por qué ambos?**
- Los sensores del suelo te dan el estado actual de las raíces
- Los sensores ambientales te ayudan a predecir la evolución (evaporación, transpiración)
- La IA puede correlacionar ambos conjuntos de datos para mejores recomendaciones

## Recomendación de Implementación

**Para el MVP, prioriza:**
1. **Humedad del suelo** (crítico para riego)
2. **Temperatura del suelo** (afecta absorción de nutrientes)
3. **Temperatura ambiente** (evapotranspiración)
4. **Datos de API climática** (pronóstico de lluvia, viento)

