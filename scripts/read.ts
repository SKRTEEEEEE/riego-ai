import { connectModbusRTU } from "../app/connect";

async function main() {
    console.log("🚀 Starting Modbus read script...");
    
    try {
        const client = await connectModbusRTU("10.20.30.152");
        // Configurar el cliente para usar una conexión RTU
        client.setID(1); // ID del dispositivo Modbus
        client.readInputRegisters(0, 10) // Leer 10 registros de entrada a partir de la dirección 0
            .then((data) => {
                console.log("📊 Datos leídos:", data.data);
            })
            .catch((error) => {
                console.error("❌ Error al leer registros:", error);
            });
        // Leer las 10 primeras bobinas (coils) desde la dirección 0
        client.readCoils(0, 10)
            .then((data) => {
                console.log("📟 Estados de las M:", data.data);
            })
            .catch((error) => {
                console.error("❌ Error al leer las M:", error);
            });
        // Leer las 10 primeras MW (holding registers) desde la dirección 0
        client.readHoldingRegisters(0, 10)
            .then((data) => {
                console.log("📝 Valores de las MW:", data.data);
            })
            .catch((error) => {
                console.error("❌ Error al leer las MW:", error);
            });
        console.log("✅ Script completed successfully");
        process.exit(1);
    } catch (error) {
        console.error("❌ Script failed:", error);
        process.exit(1);
    }
}

// Ejecutar la función main
main().catch((error) => {
    console.error("💥 Unhandled error:", error);
    process.exit(1);
});