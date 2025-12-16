import ModbusRTU from 'modbus-serial';
import { MockModbusRTU } from './modbus-mock';
import dotenv from 'dotenv';

dotenv.config();

const USE_MOCK_PLC = process.env.USE_MOCK_PLC === 'true' || process.env.NODE_ENV === 'development';

export async function connectModbusRTU(ip: string): Promise<ModbusRTU | MockModbusRTU> {
    if (USE_MOCK_PLC) {
        console.log(`🎭 [DESARROLLO] Usando Mock Modbus RTU (sin PLC física)`);
        return new MockModbusRTU();
    }

    const client = new ModbusRTU();
    console.log(`Attempting to connect to Modbus RTU on ${ip}:502...`);
    
    try {
        await client.connectTCP(ip, { port: 502 });
        console.log(`✅ Successfully connected to Modbus RTU on ${ip}`);
        
        const isConnected = client.isOpen;
        console.log(`Connection status: ${isConnected ? 'Open' : 'Closed'}`);
        return client;
    } catch (error) {
        console.error(`❌ Failed to connect to Modbus RTU on ${ip}:`, error);
        throw error;
    }
}