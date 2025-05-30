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
import { initCarouselDrag } from "./carousel.js";
document.addEventListener("DOMContentLoaded", async () => {
  let city;
  async function defaultCity() {
    const weather = await fetchWeather("Beauvais");
    if (weather) {
      await renderWeather(weather, "Beauvais");
      // console.log(weather);
      await renderHourlyForecast(weather.forecast);
      await render5DayForecast(weather.forecast);
    }
  }
  await defaultCity();
  const headerSearchForm = document.querySelector(".header_searchbar_form");
  const headerSearch = document.querySelector("#header_search");
  const mainSearchForm = document.querySelector(".main_searchbar_form");
  const mainSearch = document.querySelector("#main_search");

  [mainSearch, headerSearch].forEach((input) => {
    if (input) {
      input.addEventListener("input", (e) => {
        city = e.target.value;
      });
    }
  });
  if (mainSearchForm) {
    mainSearchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      cityFound(city);
    });
  }

  if (headerSearchForm) {
    headerSearchForm.addEventListener("submit", (e) => {
      e.preventDefault();
      cityFound(city);
    });
  }

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

  async function renderWeather(weatherData, cityLabel) {
    const mainInfo = document.querySelector(".main_info_city");
    const svgPlace = document.querySelector(".main_section_info_div1_svgplace");

    mainInfo.innerHTML = "";
    svgPlace.innerHTML = "";

    const cityName = document.createElement("p");
    cityName.classList.add("main_info_city_name");
    cityName.textContent = cityLabel;

    const cityTemp = document.createElement("p");
    cityTemp.classList.add("main_info_city_temp");
    cityTemp.textContent = Math.round(weatherData.forecast[0].temp);

    const celcius = document.createElement("span");
    celcius.classList.add("main_info_city_temp_span");
    celcius.textContent = " °C";
    cityTemp.appendChild(celcius);

    const description = document.createElement("p");
    description.classList.add("main_info_city_description");
    const descText = weatherData.forecast[0].description;
    description.textContent =
      descText.charAt(0).toUpperCase() + descText.slice(1);

    mainInfo.appendChild(cityName);
    mainInfo.appendChild(cityTemp);
    mainInfo.appendChild(description);

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

  async function renderHourlyForecast(forecastArray) {
    const wrapper = document.querySelector(
      ".main_48h_forecast_carousel_wrapper"
    );
    wrapper.innerHTML = "";

    const slice = forecastArray.slice(0, 16);

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
    initCarouselDrag(
      ".main_48h_forecast_carousel",
      ".main_48h_forecast_carousel_wrapper"
    );
  }

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
      // console.log(dayData)
      const temps = dayData.map((i) => parseFloat(i.temp));
      // console.log(temps)
      const min = Math.min(...temps);
      const max = Math.max(...temps);
      // console.log(min,max)

      const icones = {};
      for (const i of dayData) {
        icones[i.icone] = (icones[i.icone] || 0) + 1;
      }
      const icone = Object.entries(icones).sort((a, b) => b[1] - a[1])[0][0];

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

  async function fetchCity(city) {
    try {
      const res = await fetch("/api/city", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city }),
      });
      if (!res.ok) throw new Error("Erreur de requête city", res.error);
      const data = await res.json();
      return data;
    } catch (err) {
      console.log("Erreur côté front:", err);
    }
  }

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

  async function loadSVG(code) {
    try {
      const response = await fetch(`./assets/images/${code}.svg`);
      if (!response.ok) throw new Error("Échec du chargement SVG");

      const svg = await response.text();
      return svg;
    } catch (err) {
      console.error("Erreur lors du chargement de l'icône météo :", err);
    }
  }

  function getWeekDay(dateStr) {
    const days = ["Dim.", "Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam."];
    const day = dateStr.split(" ")[0];
    const date = new Date(day);
    return days[date.getDay()];
  }

  function toLocalHour(utcString) {
    const date = new Date(utcString + "Z");
    return date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }
});
