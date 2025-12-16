import { getPrediction } from "@/actions/ai";
import { getPlcStatus } from "@/actions/plc";
import IrrigationDashboard from "@/components/irrigation-dashboard/main";

export default async function Home() {
  // const res = await fetch(
  //   `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,rain,sunshine_duration,snowfall,showers`,
  //   { next: { revalidate: 60 } }
  // )
    const res = await fetch(
    `https://api.open-meteo.com/v1/forecast?latitude=41.3888&longitude=2.159&hourly=temperature_2m,relative_humidity_2m,precipitation_probability,precipitation,rain,sunshine_duration,snowfall,showers`,
    { next: { revalidate: 60 } }
  )
  const fullWeatherData = await res.json();
  
  let plcStatus = { status: false, message: "PLC unavailable" };
  let aiData = null;
  
  try {
    plcStatus = await getPlcStatus();
  } catch (error) {
    console.error("No se pudo conectar a PLC, continuando con mock:", error);
  }
  
  try {
    aiData = await getPrediction({ rangoPhIdeal: [5.5, 6], phAguaPrevio: 7.1, cultivo: "tomates" });
  } catch (error) {
    console.error("No se pudo obtener predicción IA:", error);
  }
  
  return (
    <>
      <IrrigationDashboard fullWeatherData={fullWeatherData} plcStatus={plcStatus} aiData={aiData} />
    </>
  );
}
