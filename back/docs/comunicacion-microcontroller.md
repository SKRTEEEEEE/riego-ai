# Comunicación Microcontroladores
## Distancias de LoRa en Agricultura

Según los estudios recientes:

### **Rangos Reales:**
- **Terreno plano rural**: Hasta 5 millas (8 km) en áreas rurales
- **Aplicaciones agrícolas prácticas**: 600 metros con 90% de precisión en condiciones normales
- **Terreno montañoso**: 875 metros en terrenos irregulares, cubriendo 50 hectáreas
- **Rango amplio**: Entre 300 y 3000 metros dependiendo de obstáculos

## Precios de Hardware (Estimados)

**Dispositivos ESP32 + LoRa:**
- **Módulos básicos**: €15-25 (ESP32 + SX1278)
- **Módulos avanzados**: €25-40 (ESP32 + SX1262 + OLED)
- **Gateway/Receptor**: €30-50 (con mejor antena y carcasa)

## Estrategia Recomendada para SaaS

### **Modelo Híbrido:**
1. **Sensores LoRa**: Coste bajo, instalación simple
2. **Gateway obligatorio**: Justificable por el valor del servicio
3. **Conectividad**: Gateway conecta vía WiFi/4G a tu servidor

### **Ventajas del Modelo:**
- **Escalabilidad**: Un gateway puede manejar 100+ sensores
- **Coste por sensor muy bajo**: €20-30 por punto de medición
- **Instalación simple**: No requiere infraestructura compleja
- **Autonomía**: Baterías duran 2-5 años con buen diseño

### **Propuesta de Valor:**
- Gateway: €150-200 (se amortiza rápido)
- Sensores: €25-35 cada uno
- Servicio SaaS: €X/mes por sensor o por hectárea

## Alternativas a Considerar

**Para comparar con LoRa:**
- **4G/LTE**: Mayor coste por sensor, pero no necesita gateway
- **WiFi**: Limitado en rango pero más barato
- **Sigfox/NB-IoT**: Redes existentes, pero cuotas mensuales

**¿Qué opinas del modelo gateway + sensores LoRa?** Es la estrategia más común en agricultura por su balance coste/funcionalidad.