const defaultParams = {
  starttime: "2014-01-01",
  endtime: "2026-05-02",
  latitude: 23.685,
  longitude: 90.3563,
  maxradiuskm: 100,
  limit: 100,
};

export function buildUSGSUrl(params = defaultParams) {
  // Base URL without initial query parameters
  const url = new URL("https://earthquake.usgs.gov/fdsnws/event/1/query");

  // Default parameters
  url.searchParams.set("format", "geojson");

  // Dynamically add parameters, filtering out undefined/null values
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.set(key, value);
    }
  });

  console.log("url as string from url builder", url.toString());

  return url.toString();
}

export function buildParamsObject(
  starttime,
  endtime,
  bbox,
  maxmagnitude,
  limit,
) {
  console.log({
    starttime,
    endtime,
    bbox,
    maxmagnitude,
  });

  const [minlongitude, minlatitude, maxlongitude, maxlatitude] = bbox;

  return {
    starttime,
    endtime,
    minlongitude,
    minlatitude,
    maxlongitude,
    maxlatitude,
    maxmagnitude,
    limit,
  };
}

/*
ok so far we have sort of dynamic url making and making request with it. next step should be
completing it and displaying the data in map. Good luck
*/
