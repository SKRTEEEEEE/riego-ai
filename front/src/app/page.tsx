import IrrigationDashboard from "@/components/irrigation-dashboard";

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
  return (
    <>
      <IrrigationDashboard fullWeatherData={fullWeatherData}/>
    </>
  );
}
