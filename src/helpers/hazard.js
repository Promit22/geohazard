import { buildParamsObject, buildUSGSUrl } from "./urlBuilder.js";

export async function getEarthquakes(
  startTime,
  endTime,
  bbox,
  magnitude,
  limit,
) {
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

  console.log(json);
  return json;
}

export function findEarthquake(currentId, earthquakes) {
  return earthquakes.features.find((feature) => {
    const ids = feature.properties.ids.split(",").filter(Boolean);

    return currentId.some((id) => ids.includes(id));
  });
}
