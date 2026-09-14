import { Map, setWorkerUrl, Marker, GeolocateControl } from "maplibre-gl";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?worker&url";
import { getEarthquakes } from "./helpers/hazard.js";
import { addEarthquakeLayer } from "./helpers/addmarkers.js";
setWorkerUrl(workerUrl);

const map = new Map({
  container: "demo-map", // container id
  style: "https://tiles.openfreemap.org/styles/bright", // style URL
  center: [-98.5795, 39.8283], // starting position [lng, lat]
  zoom: 2, // starting zoom
  maplibreLogo: true,
});

(async function getAndSetMarker() {
  const earthquake = await getEarthquakes(
    "2000-09-01",
    "2026-09-12",
    [-125.0011, 24.9493, -66.9326, 49.5904],
    5,
    500,
  );
  await addEarthquakeLayer(map, earthquake);
})();
