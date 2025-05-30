export default async function getForecast(city) {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&lang=fr&appid=${process.env.METEO_API_KEY}`
    );
    if (!response.ok) throw new Error("Erreur météo");

    const data = await response.json();

    const forecast = data.list.map((item) => ({
      date: item.dt_txt,
      description: item.weather[0].description,
      icone: item.weather[0].icon,
      temp: item.main.temp.toFixed(1),
      rain_mm: item.rain?.["3h"] || 0,
      wind_kmh: (item.wind.speed * 3.6).toFixed(1),
    }));
    const cityData = {
      name: data.city.name
    };
    // console.log(forecast, cityData);
    return { forecast, cityData };
  } catch (err) {
    console.log("Erreur dans meteoApi.js :", err);
    throw err;
  }
}
