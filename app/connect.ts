import ModbusRTU from 'modbus-serial';



export async function connectModbusRTU(ip: string): Promise<ModbusRTU> {
    const client = new ModbusRTU();
    console.log(`Attempting to connect to Modbus RTU on ${ip}:502...`);
    
    try {
        await client.connectTCP(ip, { port: 502 });
        console.log(`✅ Successfully connected to Modbus RTU on ${ip}`);
        
        // Opcional: hacer una prueba de lectura para verificar la conexión
        const isConnected = client.isOpen;
        console.log(`Connection status: ${isConnected ? 'Open' : 'Closed'}`);
        return client;
    } catch (error) {
        console.error(`❌ Failed to connect to Modbus RTU on ${ip}:`, error);
        throw error;
    }
}