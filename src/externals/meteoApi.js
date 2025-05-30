// Fonction exportée par défaut qui récupère les prévisions météo pour une ville donnée
export default async function getForecast(city) {
  try {
    // Requête vers l’API OpenWeather pour récupérer les prévisions 5 jours toutes les 3h
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&lang=fr&appid=${process.env.METEO_API_KEY}`
    );

    // Si la requête échoue (code HTTP non 200), on lance une erreur
    if (!response.ok) throw new Error("Erreur météo");

    // On parse les données de la réponse en JSON
    const data = await response.json();

    // On extrait et transforme chaque prévision du tableau `list` fourni par OpenWeather
    const forecast = data.list.map((item) => ({
      date: item.dt_txt,                                // Date/heure en UTC sous forme de chaîne
      description: item.weather[0].description,         // Description météo (ex: ciel dégagé)
      icone: item.weather[0].icon,                      // Code de l’icône météo (ex: 01d, 04n…)
      temp: item.main.temp.toFixed(1),                  // Température arrondie à 1 décimale
      rain_mm: item.rain?.["3h"] || 0,                  // Précipitations sur 3h (si dispo), sinon 0
      wind_kmh: (item.wind.speed * 3.6).toFixed(1),     // Vent en m/s → conversion en km/h
    }));

    // On récupère aussi le nom de la ville pour l’afficher côté front
    const cityData = {
      name: data.city.name
    };

    // On retourne un objet contenant les prévisions et les infos sur la ville
    return { forecast, cityData };
  } catch (err) {
    // Si une erreur survient (fetch ou parsing), on log dans la console et on relance
    console.log("Erreur dans meteoApi.js :", err);
    throw err;
  }
}
