import { connectModbusRTU } from "./modbus"

export const clickBotonVerde = async (state: boolean, ip = "10.20.30.152") => {
    try {
        const client = await connectModbusRTU(ip);
        client.setID(1); // ID del dispositivo Modbus

        // Escribir valor 1 en la dirección de la bobina para activar el botón verde
        await client.writeCoil(0, state); // Dirección 0 para el botón verde
        // Esperar 1 segundo para asegurar que la acción se complete
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Escribir valor 0 para desactivar el botón verde
        await client.writeCoil(0, !state); // Desactivar el botón verde
        console.log("✅ Botón verde activado");
        return true;
    } catch (error) {
        console.error("❌ Error al activar el botón verde:", error);
        return false;
    }
}