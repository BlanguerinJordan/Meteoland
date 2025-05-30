export default async function getCity(city) {
  const isPostcode = /^\d{5}$/.test(city);
  const isCityName = /^[a-zA-ZÀ-ÿ' -]{1,}$/.test(city.trim());

  if (!isPostcode && !isCityName) {
    throw new Error("Format de ville invalide");
  }

  const baseUrl = "https://geo.api.gouv.fr/communes?";
  const queryParam = isPostcode
    ? `codePostal=${city}`
    : `nom=${encodeURIComponent(city)}`;

  const url = `${baseUrl}${queryParam}&fields=code,nom,centre,codesPostaux`;

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Erreur ville");

    const data = await response.json();
    let cityData;
    cityData = data
      .filter((item) => {
        if (isPostcode) {
          return item.codesPostaux.includes(city);
        } else {
          return item.nom.toLowerCase() === city.trim().toLowerCase();
        }
      })
      .slice(0,5)
      .map((item) => ({
        city: item.nom,
        postcode: item.codesPostaux[0],
      }));

    // console.log(cityData);
    return cityData;
  } catch (err) {
    console.log("Erreur dans cityApi.js :", err);
    throw err;
  }
}
