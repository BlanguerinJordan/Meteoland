import getForecast from "../../externals/meteoApi.js";

export default async function handler(req, res) {
  if (req.method !== "POST") 
    return res.status(405).json({ error: "Méthode non autorisée" });
  
  const { city } = req.body;

  if (!city) {
    return res.status(400).json({ error: "Nom de la ville requis" });
  }

  try {
    const weatherData = await getForecast(city);
    res.json(weatherData);
  } catch (err) {
    console.error("Erreur /api/weather :", err);
    res.status(500).json({ error: "Impossible de récupérer la météo" });
  }
}
