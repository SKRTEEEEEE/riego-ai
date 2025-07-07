import { connectModbusRTU } from "../app/modbus";

async function main() {
    console.log("🚀 Starting Modbus connection script...");
    
    try {
        await connectModbusRTU("10.20.30.152");
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