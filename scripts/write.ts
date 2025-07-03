import { connectModbusRTU } from "../app/connect";

async function main() {
    console.log("🚀 Starting Modbus write script...");
    
    try {
        const client = await connectModbusRTU("10.20.30.152");
        client.setID(1); // ID del dispositivo Modbus

        // Escribir valores en las primeras cinco MW (holding registers)
        const valores = [11123, 4560, 789, 1011, 1213]; // Valores de ejemplo para MW0 a MW4
        await client.writeRegisters(0, valores);
        console.log("✅ Valores escritos en las primeras cinco MW:", valores);

        // Leer para verificar
        const data = await client.readHoldingRegisters(0, 5);
        console.log("📝 Valores actuales de las MW:", data.data);

        console.log("✅ Script completed successfully");
        process.exit(1);
    } catch (error) {
        console.error("❌ Script failed:", error);
        process.exit(1);
    }
}

main().catch((error) => {
    console.error("💥 Unhandled error:", error);
    process.exit(1);
});