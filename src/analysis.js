import { Map, setWorkerUrl, Marker, GeolocateControl } from "maplibre-gl";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import {
  renderEarthquakeInputs,
  renderFloodInputs,
} from "./helpers/analysisHelper.js";
import { countryCodesAndBboxes } from "./helpers/isoCode.js";
import { showError, clearError } from "./helpers/errorHandler.js";
import { buildParamsObject, buildUSGSUrl } from "./helpers/urlBuilder.js";
import { getEarthquakes } from "./helpers/hazard.js";
import { addEarthquakeLayer } from "./helpers/addmarkers.js";

setWorkerUrl(workerUrl);

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

  // 1. Convert ISO codes to full localized names and sort alphabetically
  // const regionNames = new Intl.DisplayNames(["en"], { type: "region" });
  // const countries = countryCodesAndBboxes
  //   .map((country) => {
  //     try {
  //       return regionNames.of(country.code);
  //     } catch {
  //       return null;
  //     }
  //   })
  //   .filter(Boolean)
  //   .sort((a, b) => a.localeCompare(b));

  // 2. Check or create the <datalist> element
  let datalist = document.getElementById("country-list");
  if (!datalist) {
    datalist = document.createElement("datalist");
    datalist.id = "country-list";

    // 3. Use DocumentFragment to batch DOM insertions safely without innerHTML
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < countryCodesAndBboxes.length; i++) {
      const option = document.createElement("option");
      option.value = countryCodesAndBboxes[i]["name"];
      fragment.appendChild(option);
    }

    datalist.appendChild(fragment);
    document.body.appendChild(datalist);
  }

  // 4. Link datalist to <input id="country">
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
  // const formData = new FormData(form);
  // const hazard = formData.get("hazard");
  // const country = formData.get("country");
  // const startTime = formData.get("start-time");
  // const endTime = formData.get("end-time");
  // // const radius = formData.get("radius");
  // // const radiusInput = formData.get("radius-unit");
  // const magnitude = formData.get("magnitude");
  // // console.log(formData, hazard);

  let isValid = true;
  let firstInvalidInput = null;

  const country = document.getElementById("country");
  const startTime = document.getElementById("start-time");
  const endTime = document.getElementById("end-time");
  const magnitude = document.getElementById("magnitude").value || 5;
  const limit = document.getElementById("limit").value || 500;

  [(country, startTime, endTime)].forEach(clearError);

  // 1. Validate Required Fields
  if (!country.value.trim()) {
    showError(country, "Please enter a country name.");
    isValid = false;
    if (!firstInvalidInput) firstInvalidInput = country;
  }

  //make it report invalid country name
  // if (country.value.trim()) {
  //   showError(country, "Please enter a country name.");
  //   isValid = false;
  //   if (!firstInvalidInput) firstInvalidInput = country;
  // }

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
  const countryBbox = countryCodesAndBboxes.find((c) => {
    return (
      country.value.trim().toString().toLowerCase() === c.name.toLowerCase()
    );
  });

  setEarthquakeOnMap(
    startTime.value,
    endTime.value,
    countryBbox.bbox,
    magnitude,
    limit,
  );

  // earthquake = ;
  // console.log(earthquake);

  // const paramsObj = buildParamsObject(
  //   startTime.value,
  //   endTime.value,
  //   countryBbox.bbox,
  // );
  // console.log(paramsObj);

  // const url = buildUSGSUrl(paramsObj);
});

const map = new Map({
  container: "map", // container id
  style: "https://tiles.openfreemap.org/styles/bright", // style URL
  center: [90.3563, 23.685], // starting position [lng, lat]
  zoom: 6, // starting zoom
  maplibreLogo: true,
});

async function setEarthquakeOnMap(starttime, endtime, bbox, magnitude, limit) {
  earthquake = await getEarthquakes(starttime, endtime, bbox, magnitude, limit);
  console.log(" earthquake from setearthquake", earthquake);

  await addEarthquakeLayer(map, earthquake);
}
// addEarthquakeLayer(map, earthquake);
