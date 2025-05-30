// On importe la fonction getCity depuis l'API externe
import getCity from "../../externals/cityApi.js";

// Fonction handler pour l'API route /api/city (dans Next.js ou équivalent)
export default async function handler(req, res) {
  // Si la méthode HTTP n'est pas POST, on retourne une erreur 405 (méthode non autorisée)
  if (req.method !== "POST") 
    return res.status(405).json({ error: "Méthode non autorisée" });

  // On extrait la propriété "city" du body de la requête
  const { city } = req.body;

  // Si aucun nom de ville n'est fourni, on retourne une erreur 400 (bad request)
  if (!city) {
    return res.status(400).json({ error: "nom de la ville requises" });
  }

  try {
    // On appelle la fonction getCity pour récupérer les données de la ville
    const cityData = await getCity(city);

    // On retourne les données de la ville en réponse JSON
    res.json(cityData);
  } catch (err) {
    // En cas d'erreur (ex: fetch, parsing…), on log dans la console
    console.error("Erreur /api/city :", err);

    // On retourne une erreur serveur 500
    res.status(500).json({ error: "Impossible de récupérer la ville" });
  }
}
