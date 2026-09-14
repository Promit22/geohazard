import { Map, setWorkerUrl, Marker, Popup } from "maplibre-gl";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import {
  renderEarthquakeInputs,
  renderFloodInputs,
  renderCardDetails,
  generateEarthquakeKv,
  renderCollapsibleCard,
} from "./helpers/analysisHelper.js";
import { countryCodesAndBboxes } from "./helpers/isoCode.js";
import { showError, clearError } from "./helpers/errorHandler.js";

import { getEarthquakes } from "./helpers/hazard.js";
import { addEarthquakeLayer } from "./helpers/addmarkers.js";
import { findEarthquake } from "./helpers/hazard.js";
import { getOverturePlaces } from "./helpers/places.js";
import { generatePlacesCategory } from "./helpers/places.js";
import { distanceKm } from "./helpers/places.js";

setWorkerUrl(workerUrl);

const map = new Map({
  container: "map", // container id
  style: "https://tiles.openfreemap.org/styles/liberty", // style URL
  center: [90.3563, 23.685], // starting position [lng, lat]
  zoom: 6, // starting zoom
  maplibreLogo: true,
});

const hazardType = document.getElementById("hazard-type");

function renderHazardOptions() {
  const selectedHazard = hazardType.value;

  if (selectedHazard === "earthquake") {
    renderEarthquakeInputs();
  } else if (selectedHazard === "flood") {
    renderFloodInputs();
  }
}

// Initial render
renderHazardOptions();

console.log(hazardType.value);
hazardType.addEventListener("change", (event) => {
  const selectedHazard = event.target.value;
  if (selectedHazard === "earthquake") {
    renderEarthquakeInputs();
  } else if (selectedHazard === "flood") {
    renderFloodInputs();
  }
  console.log(selectedHazard);
});

function setupCountryAutocomplete() {
  const countryInput = document.getElementById("country");
  if (!countryInput) return;

  let datalist = document.getElementById("country-list");
  if (!datalist) {
    datalist = document.createElement("datalist");
    datalist.id = "country-list";

    const fragment = document.createDocumentFragment();

    for (let i = 0; i < countryCodesAndBboxes.length; i++) {
      const option = document.createElement("option");
      option.value = countryCodesAndBboxes[i]["name"];
      fragment.appendChild(option);
    }

    datalist.appendChild(fragment);
    document.body.appendChild(datalist);
  }

  countryInput.setAttribute("list", "country-list");
}

document.addEventListener("DOMContentLoaded", setupCountryAutocomplete);

const form = document.getElementById("config-form");
let earthquake = null;

form.addEventListener("input", (e) => {
  if (e.target.matches("input, select")) {
    clearError(e.target);
  }
});

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let isValid = true;
  let firstInvalidInput = null;

  const country = document.getElementById("country");
  const startTime = document.getElementById("start-time");
  const endTime = document.getElementById("end-time");
  const magnitude = document.getElementById("magnitude").value || 5;
  const limit = document.getElementById("limit").value || 500;

  [(country, startTime, endTime)].forEach(clearError);

  const isValidCountry = countryCodesAndBboxes.find((c) => {
    return (
      c.name.toLowerCase() === country.value.trim().toString().toLowerCase()
    );
  });

  // 1. Validate Required Fields
  if (!country.value.trim()) {
    showError(country, "Please enter a country name.");
    isValid = false;
    if (!firstInvalidInput) firstInvalidInput = country;
  }
  if (!isValidCountry) {
    showError(country, "Please enter a valid country name.");
    isValid = false;
    if (!firstInvalidInput) firstInvalidInput = country;
  }

  if (!startTime.value) {
    showError(startTime, "Please select a start date.");
    isValid = false;
    if (!firstInvalidInput) firstInvalidInput = startTime;
  }

  if (!endTime.value) {
    showError(endTime, "Please select an end date.");
    isValid = false;
    if (!firstInvalidInput) firstInvalidInput = endTime;
  }

  // 2. Validate Logical Constraint (End date after Start date)
  if (startTime.value && endTime.value && startTime.value > endTime.value) {
    showError(endTime, "End date cannot be earlier than start date.");
    isValid = false;
    if (!firstInvalidInput) firstInvalidInput = endTime;
  }

  // 3. Handle Invalid Form (Focus first bad field)
  if (!isValid) {
    firstInvalidInput.focus();
    return;
  }

  console.log("start time", startTime.value);
  console.log("start time", endTime.value);

  const currentCountry = countryCodesAndBboxes.find((c) => {
    return (
      country.value.trim().toString().toLowerCase() === c.name.toLowerCase()
    );
  });

  setEarthquakeOnMap(
    startTime.value,
    endTime.value,
    currentCountry.bbox,
    magnitude,
    limit,
  );

  map.fitBounds(currentCountry.bbox, {
    duration: 4000,
    padding: 50,
  });
});

async function setEarthquakeOnMap(starttime, endtime, bbox, magnitude, limit) {
  earthquake = await getEarthquakes(starttime, endtime, bbox, magnitude, limit);
  console.log(" earthquake from setearthquake", earthquake);

  await addEarthquakeLayer(map, earthquake);
}

const loading = document.getElementById("loading");

map.on("click", "earthquake-points", async (e) => {
  const featureId = e.features[0]["properties"]["ids"]
    .split(",")
    .filter(Boolean);

  console.log(featureId);
  const usgsEar = findEarthquake(featureId, earthquake);

  const currentEarthquake = usgsEar ? usgsEar : e.features[0];

  console.log("Current earthquake:", currentEarthquake);
  const [lng, lat, dep] = currentEarthquake.geometry.coordinates;

  map.flyTo({
    center: [lng, lat],
    zoom: 10,
    duration: 1000,
  });
  console.log(e.features[0]);

  const radius = 10;

  const circle = turf.circle([lng, lat], radius, {
    steps: 64,
    units: "kilometers",
  });

  const source = map.getSource("location-radius");

  if (source) {
    source.setData(circle);
  } else {
    map.addSource("location-radius", {
      type: "geojson",
      data: circle,
    });

    map.addLayer({
      id: "location-radius",
      type: "fill",
      source: "location-radius",
      paint: {
        "fill-color": "#8CCFFF",
        "fill-opacity": 0.5,
      },
    });

    map.addLayer({
      id: "location-radius-outline",
      type: "line",
      source: "location-radius",
      paint: {
        "line-color": "#0094ff",
        "line-width": 3,
      },
    });
  }

  console.log("Coordinates:", lat, lng, dep);
  const earthquakeKv = generateEarthquakeKv(currentEarthquake, dep);
  renderCardDetails("details", "Earthquake Details", earthquakeKv);
  const categoryContainer = document.getElementById("category");
  const info = document.getElementById("info");
  if (info) info.style.display = "none";
  const imgElm = document.createElement("img");
  imgElm.src = "./assets/loading.gif";
  imgElm.id = "loading";
  categoryContainer.appendChild(imgElm);

  imgElm.style.display = "block";

  try {
    const places = await getOverturePlaces(
      lat,
      lng,
      10000,
      "ovt_OvhhpmB2VF6uDu9CCGsGoXGu5xspMbXwfj38NqgzKvnz0C1h28RKxUj4myRlxb5J",
    );

    imgElm.style.display = "none";

    const totalPlaces = places.features.length;
    const placesCategory = generatePlacesCategory(places);

    renderCollapsibleCard(
      "category",
      "Potentially Exposed",
      [
        {
          key: "Places",
          value: `${totalPlaces}${totalPlaces === 25000 ? "+" : ""}`,
        },
      ],
      placesCategory,
    );
    const nearestPlaces = places.features
      .map((place) => {
        const [placeLng, placeLat] = place.geometry.coordinates;

        return {
          feature: place,
          distance: distanceKm(lat, lng, placeLat, placeLng),
        };
      })
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 10);
    console.log("nearest places", nearestPlaces);

    nearestPlaces.forEach((place) => {
      const popup = new Popup({
        offset: 25,
      }).setHTML(`
        <strong>${place.feature.properties.names.primary}</strong>
        <br>
        ${place.distance.toFixed(2)} km from earthquake
    `);

      const marker = new Marker()
        .setLngLat(place.feature.geometry.coordinates)
        .setPopup(popup)
        .addTo(map);

      marker.getElement().style.cursor = "pointer";
    });

    console.log("places category", placesCategory);

    console.log("Overture response:", places);
    console.log("Number returned:", places.features.length);
  } catch (error) {
    console.error("Failed to get Overture places:", error);
  }
});
