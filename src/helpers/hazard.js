import { buildParamsObject, buildUSGSUrl } from "./urlBuilder.js";

export async function getEarthquakes(
  startTime,
  endTime,
  bbox,
  magnitude,
  limit,
) {
  // const baseUrl = 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson'
  const paramsObject = buildParamsObject(
    startTime,
    endTime,
    bbox,
    magnitude,
    limit,
  );
  const url = buildUSGSUrl(paramsObject);
  const raw = await fetch(url);
  const json = await raw.json();
  // const modified = json.map((e) => {

  // })
  console.log(json);
  return json;
}
