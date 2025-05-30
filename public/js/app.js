// non utilisé pour l'instant
// let session = null;
// let currentuser=null;
// let userName = "";
// try {
//   const res = await fetch("/api/me", {
//     method: "POST",
//     credentials: "include",
//   });

//   if (!res.ok) throw new Error("Non connecté");
//   const data = await res.json();
//   session = true;
//   userName = data.user;
//   currentuser = data.iduser;
//   console.log(currentuser, userName);
// } catch (err) {
//   session = false;
//   console.log("Pas de session active:", err.message);
// }

// Importe la fonction de drag du carrousel
import { initCarouselDrag } from "./carousel.js";

// Lorsque le DOM est prêt...
document.addEventListener("DOMContentLoaded", async () => {
  let city;

  // Affiche la météo par défaut (Beauvais) au chargement
  async function defaultCity() {
    const weather = await fetchWeather("Beauvais");
    if (weather) {
      await renderWeather(weather, "Beauvais");
      console.log(weather); // Debug
      await renderHourlyForecast(weather.forecast);
      await render5DayForecast(weather.forecast);
    }
  }
  await defaultCity();

  // Récupère les champs et formulaires de recherche
  const headerSearchForm = document.querySelector(".header_searchbar_form");
  const headerSearch = document.querySelector("#header_search");
  const mainSearchForm = document.querySelector(".main_searchbar_form");
  const mainSearch = document.querySelector("#main_search");

  // Écoute la saisie de l'utilisateur sur les 2 barres de recherche
  [mainSearch, headerSearch].forEach((input) => {
    if (input) {
      input.addEventListener("input", (e) => {
        city = e.target.value;
      });
    }
  });

  // Soumission de la barre de recherche principale
  if (mainSearchForm) {
    mainSearchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      cityFound(city);
    });
  }

  // Soumission de la barre de recherche du header
  if (headerSearchForm) {
    headerSearchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      cityFound(city);
    });
  }

  // Requête météo quand l'utilisateur cherche une ville
  async function cityFound(city) {
    try {
      const result = await fetchCity(city);
      const cityLabel = result[0].city;
      const weather = await fetchWeather(cityLabel);
      if (weather) {
        await renderWeather(weather, cityLabel);
        await renderHourlyForecast(weather.forecast);
        await render5DayForecast(weather.forecast);
      }
    } catch (err) {
      console.error("Erreur pendant la recherche de ville ou météo :", err);
    }
  }

  // Affiche les infos météo générales (ville, température, icône, description)
  async function renderWeather(weatherData, cityLabel) {
    const mainInfo = document.querySelector(".main_info_city");
    const svgPlace = document.querySelector(".main_section_info_div1_svgplace");

    mainInfo.innerHTML = "";
    svgPlace.innerHTML = "";

    // Nom de la ville
    const cityName = document.createElement("p");
    cityName.classList.add("main_info_city_name");
    cityName.textContent = cityLabel;

    // Température
    const cityTemp = document.createElement("p");
    cityTemp.classList.add("main_info_city_temp");
    cityTemp.textContent = Math.round(weatherData.forecast[0].temp);
    const celcius = document.createElement("span");
    celcius.classList.add("main_info_city_temp_span");
    celcius.textContent = " °C";
    cityTemp.appendChild(celcius);

    // Description météo
    const description = document.createElement("p");
    description.classList.add("main_info_city_description");
    const descText = weatherData.forecast[0].description;
    description.textContent =
      descText.charAt(0).toUpperCase() + descText.slice(1);

    // Ajout dans le DOM
    mainInfo.appendChild(cityName);
    mainInfo.appendChild(cityTemp);
    mainInfo.appendChild(description);

    // Ajout de l'icône SVG
    const svgIcon = await loadSVG(weatherData.forecast[0].icone);
    if (svgIcon) {
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgIcon, "image/svg+xml");
      const svgElement = svgDoc.documentElement;
      svgElement.removeAttribute("width");
      svgElement.removeAttribute("height");
      svgElement.classList.add("main_section2_div1__info_svg");
      svgPlace.appendChild(svgElement);
    }
  }

  // Affiche le carrousel des prévisions sur 48h (par tranches de 3h)
  async function renderHourlyForecast(forecastArray) {
    const wrapper = document.querySelector(".main_48h_forecast_carousel_wrapper");
    wrapper.innerHTML = "";
    const slice = forecastArray.slice(0, 16); // 48h = 16 * 3h

    for (const forecast of slice) {
      const item = document.createElement("div");
      item.classList.add("forecast_carousel_item");

      const hour = document.createElement("p");
      hour.textContent = toLocalHour(forecast.date);

      const svgCode = await loadSVG(forecast.icone);
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svgCode, "image/svg+xml");
      const svgElement = svgDoc.documentElement;

      const temp = document.createElement("p");
      temp.textContent = `${Math.round(forecast.temp)} °C`;

      item.appendChild(hour);
      item.appendChild(svgElement);
      item.appendChild(temp);
      wrapper.appendChild(item);
    }

    initCarouselDrag(".main_48h_forecast_carousel", ".main_48h_forecast_carousel_wrapper");
  }

  // Affiche les prévisions sur 5 jours
  async function render5DayForecast(forecastArray) {
    const container = document.querySelector(".main_5d_forecast_div");
    container.innerHTML = "";

    const daysMap = {};
    for (const item of forecastArray) {
      const date = new Date(item.date + "Z");
      const dayKey = date.toISOString().split("T")[0];
      if (!daysMap[dayKey]) daysMap[dayKey] = [];
      daysMap[dayKey].push(item);
    }

    const dayKeys = Object.keys(daysMap).slice(0, 5);

    for (const key of dayKeys) {
      const dayData = daysMap[key];
      const temps = dayData.map((i) => parseFloat(i.temp));
      const min = Math.min(...temps);
      const max = Math.max(...temps);

      // Récupère l’icône météo la plus fréquente du jour
      const icones = {};
      for (const i of dayData) {
        icones[i.icone] = (icones[i.icone] || 0) + 1;
      }
      const icone = Object.entries(icones).sort((a, b) => b[1] - a[1])[0][0];

      // Création de l'affichage
      const dayName = getWeekDay(key);
      const div = document.createElement("div");
      div.classList.add("main_5d_forecast_div_days");

      const name = document.createElement("p");
      name.classList.add("main_5d_forecast_div_days_name");
      name.textContent = dayName;

      const inner = document.createElement("div");
      inner.classList.add("main_5d_forecast_div_days_div");

      const temp = document.createElement("p");
      temp.classList.add("main_5d_forecast_div_days_temp");
      temp.textContent = `${Math.round(min)} - ${Math.round(max)}`;

      const svg = await loadSVG(icone);
      const parser = new DOMParser();
      const svgDoc = parser.parseFromString(svg, "image/svg+xml");
      const svgEl = svgDoc.documentElement;
      svgEl.classList.add("main_5d_forecast_div_days_svg");

      inner.appendChild(svgEl);
      inner.appendChild(temp);
      div.appendChild(name);
      div.appendChild(inner);
      container.appendChild(div);
    }
  }

  // Requête API vers /api/city
  async function fetchCity(city) {
    try {
      const res = await fetch("/api/city", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city }),
      });
      if (!res.ok) throw new Error("Erreur de requête city");
      const data = await res.json();
      return data;
    } catch (err) {
      console.log("Erreur côté front:", err);
    }
  }

  // Requête API vers /api/weather
  async function fetchWeather(city) {
    try {
      const res = await fetch("/api/weather", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city }),
      });
      if (!res.ok) throw new Error("Erreur de requête météo");
      const data = await res.json();
      return data;
    } catch (err) {
      console.error("Erreur côté front :", err);
    }
  }

  // Charge dynamiquement un fichier SVG météo
  async function loadSVG(code) {
    try {
      const response = await fetch(`./assets/images/${code}.svg`);
      if (!response.ok) throw new Error("Échec du chargement SVG");
      return await response.text();
    } catch (err) {
      console.error("Erreur lors du chargement de l'icône météo :", err);
    }
  }

  // Récupère le jour de la semaine au format court
  function getWeekDay(dateStr) {
    const days = ["Dim.", "Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam."];
    const day = dateStr.split(" ")[0];
    const date = new Date(day);
    return days[date.getDay()];
  }

  // Transforme une date UTC en heure locale (ex: "15:00")
  function toLocalHour(utcString) {
    const date = new Date(utcString + "Z");
    return date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }
});

