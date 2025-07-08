import { obtenerDatosClimaticos } from "@/app/weather";

async function main() {
return await obtenerDatosClimaticos(41.3888, 2.159);
}

main().then((res)=>console.log(res)).catch((err)=>console.error(err));