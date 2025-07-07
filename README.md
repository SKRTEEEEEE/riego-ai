# Riego Automatizado con Inteligencia Artificial
## Servicios externos utilizados
- [OpenMeteo](https://open-meteo.com/): https://api.open-meteo.com/v1/forecast?latitude=41.3888&longitude=2.159&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,rain,sunshine_duration,snowfall,showers
## 🌱 Flujo del Servidor 
### **Versión 0**

---

### 📡 **Microcontrolador Fake** [`mc-fake.ts`](./src/app/mc-fake.ts)
> **Simulación de Sensores**
- Creación de datos falsos simulando los microcontroladores
- Generación de lecturas de sensores (humedad, temperatura, pH)

⬇️

### 💾 **Guardar Lecturas DB** [`db.ts`](./src/app/db.ts)
> **Persistencia de Datos**
- Almacenamiento de los datos simulados de los microcontroladores

⬇️

### ⚙️ **Media Fake** [`media-fake.ts`](./src/app/media-fake.ts)
> **Procesamiento Central**
- Servidor que procesa los datos simulados de los microcontroladores

⬇️

### 🌤️ **Obtener Datos Climáticos** [`weather.ts`](./src/app/weather.ts)
> **Información Meteorológica**
- Consulta APIs externas del clima
- Recopilación de condiciones ambientales

⬇️

### 🤖 **Obtener Recomendación Riego** [`ai-pred.ts`](./src/app/ai-pred.ts)
> **Sistema de Decisión Inteligente**
- Análisis de datos combinados (sensores + clima)
- Generación de recomendaciones personalizadas

⬇️ 🏗️

### 👤 **Consultar al Usuario**
> **Interacción Humana**
- Presentación de recomendaciones al usuario
- Solicitud de confirmación para aplicar cambios

⬇️

### 🎛️ **Aplicar si lo Desea**
> **Ejecución Automática**
- Envío de comandos a la PLC
- Implementación de las recomendaciones aprobadas

⬇️

### ✏️ **Modificar Específicamente**
> **Personalización Manual**
- Ajuste manual de parámetros específicos
- Modificación mediante prompt de usuario

---
