import getCity from "../../externals/cityApi.js";

export default async function handler(req, res) {
  if (req.method !== "POST") 
    return res.status(405).json({ error: "Méthode non autorisée" });
  
  const { city } = req.body;

  if (!city) {
    return res.status(400).json({ error: "nom de la ville requises" });
  }

  try {
    const cityData = await getCity(city);
    res.json(cityData);
  } catch (err) {
    console.error("Erreur /api/city :", err);
    res.status(500).json({ error: "Impossible de récupérer la ville" });
  }
}
