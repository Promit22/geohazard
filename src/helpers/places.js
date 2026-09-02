export async function getOverturePlaces(
  lat,
  lng,
  radius,
  apiKey = "DEMO API KEY",
) {
  const params = new URLSearchParams({
    lat: String(lat),
    lng: String(lng),
    radius: String(radius),
    limit: "25000",
    format: "geojson",
  });

  const url = `https://api.overturemapsapi.com/places?${params}`;

  const response = await fetch(url, {
    headers: {
      "x-api-key": apiKey,
    },
  });

  if (!response.ok) {
    throw new Error(
      `Overture API error: ${response.status} ${response.statusText}`,
    );
  }

  return await response.json();
}
