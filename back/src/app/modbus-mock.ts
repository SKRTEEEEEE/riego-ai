// Mock de ModbusRTU para desarrollo sin PLC física

export class MockModbusRTU {
  private registers: Map<number, number> = new Map();
  private coils: Map<number, boolean> = new Map();
  public isOpen: boolean = true;
  private clientID: number = 1;

  constructor() {
    // Inicializar registros simulados
    for (let i = 0; i < 100; i++) {
      this.registers.set(i, 0);
      this.coils.set(i, false);
    }
  }

  setID(id: number) {
    this.clientID = id;
  }

  async writeCoil(address: number, value: boolean): Promise<void> {
    this.coils.set(address, value);
    console.log(`[MOCK] Escribir bobina ${address}: ${value}`);
  }

  async readCoils(address: number, length: number): Promise<boolean[]> {
    const result = [];
    for (let i = 0; i < length; i++) {
      result.push(this.coils.get(address + i) || false);
    }
    console.log(`[MOCK] Leer bobinas ${address}-${address + length - 1}:`, result);
    return result;
  }

  async writeRegister(address: number, value: number): Promise<void> {
    this.registers.set(address, value);
    console.log(`[MOCK] Escribir registro ${address}: ${value}ms`);
  }

  async readRegisters(address: number, length: number): Promise<number[]> {
    const result = [];
    for (let i = 0; i < length; i++) {
      result.push(this.registers.get(address + i) || 0);
    }
    console.log(`[MOCK] Leer registros ${address}-${address + length - 1}:`, result);
    return result;
  }

  async close(): Promise<void> {
    this.isOpen = false;
    console.log('[MOCK] Conexión Modbus cerrada');
  }

  // Getters para debugging
  getCoilState(address: number): boolean {
    return this.coils.get(address) || false;
  }

  getRegisterValue(address: number): number {
    return this.registers.get(address) || 0;
  }

  getAllCoils(): Record<number, boolean> {
    const result: Record<number, boolean> = {};
    this.coils.forEach((value, key) => {
      if (value) result[key] = value; // Solo mostrar los que están activos
    });
    return result;
  }

  getAllRegisters(): Record<number, number> {
    const result: Record<number, number> = {};
    this.registers.forEach((value, key) => {
      if (value > 0) result[key] = value; // Solo mostrar los que tienen valor
    });
    return result;
  }
}
