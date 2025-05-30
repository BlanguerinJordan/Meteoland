// On importe la fonction getForecast depuis le fichier d'API externe
import getForecast from "../../externals/meteoApi.js";

// Fonction handler pour l'API route /api/weather
export default async function handler(req, res) {
  // On vérifie que la méthode HTTP utilisée est POST
  if (req.method !== "POST") 
    return res.status(405).json({ error: "Méthode non autorisée" });

  // On récupère la propriété "city" envoyée dans le body de la requête
  const { city } = req.body;

  // Si aucun nom de ville n'est fourni, on retourne une erreur 400
  if (!city) {
    return res.status(400).json({ error: "Nom de la ville requis" });
  }

  try {
    // On appelle la fonction getForecast avec le nom de la ville pour obtenir les données météo
    const weatherData = await getForecast(city);

    // On retourne ces données sous forme de réponse JSON
    res.json(weatherData);
  } catch (err) {
    // En cas d'erreur lors de la récupération ou du traitement des données météo
    console.error("Erreur /api/weather :", err);

    // On renvoie une erreur 500 avec un message clair
    res.status(500).json({ error: "Impossible de récupérer la météo" });
  }
}
