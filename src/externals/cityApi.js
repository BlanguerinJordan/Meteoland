// Fonction principale exportée par défaut, qui prend une ville (ou un code postal) en argument
export default async function getCity(city) {
  // Vérifie si l'entrée est un code postal (5 chiffres)
  const isPostcode = /^\d{5}$/.test(city);

  // Vérifie si l'entrée est un nom de ville (lettres, accents, tirets, apostrophes, espaces)
  const isCityName = /^[a-zA-ZÀ-ÿ' -]{1,}$/.test(city.trim());

  // Si ni un code postal ni un nom de ville valide, on lance une erreur
  if (!isPostcode && !isCityName) {
    throw new Error("Format de ville invalide");
  }

  // URL de base de l’API Geo du gouvernement français
  const baseUrl = "https://geo.api.gouv.fr/communes?";

  // Génère les bons paramètres en fonction du type d’entrée
  const queryParam = isPostcode
    ? `codePostal=${city}` // Si c’est un code postal, on cherche par codePostal
    : `nom=${encodeURIComponent(city)}`; // Sinon on encode et cherche par nom

  // Construction finale de l’URL avec les champs qu’on souhaite récupérer
  const url = `${baseUrl}${queryParam}&fields=code,nom,centre,codesPostaux`;

  try {
    // On fait la requête vers l’API
    const response = await fetch(url);

    // Si la réponse n’est pas correcte (status HTTP), on renvoie une erreur
    if (!response.ok) throw new Error("Erreur ville");

    // On parse le JSON
    const data = await response.json();

    let cityData;

    // On filtre et transforme les résultats
    cityData = data
      .filter((item) => {
        // Si c’est un code postal, on vérifie qu’il est bien dans la liste des codes de la commune
        if (isPostcode) {
          return item.codesPostaux.includes(city);
        } else {
          // Sinon, on fait une égalité stricte sur le nom (insensible à la casse)
          return item.nom.toLowerCase() === city.trim().toLowerCase();
        }
      })
      .slice(0, 5) // On limite à 5 résultats max
      .map((item) => ({
        city: item.nom, // Nom de la commune
        postcode: item.codesPostaux[0], // On prend le premier code postal de la liste
      }));

    // On retourne le tableau d’objets contenant les villes filtrées
    return cityData;
  } catch (err) {
    // En cas d’erreur, on affiche un log et on relance l’erreur
    console.log("Erreur dans cityApi.js :", err);
    throw err;
  }
}