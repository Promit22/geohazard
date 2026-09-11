export async function getOverturePlaces(
  lat = -33.891,
  lng = 151.2769,
  radius = 2000,
  apiKey = "DEMO-API-KEY",
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

export function distanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;

  return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// export function generatePlacesCategory(places) {
//   const placesByCategory = {};
//   for (const place of places.features) {
//     const category = place.properties.basic_category;

//     if (!category) continue;

//     if (!placesByCategory[category]) {
//       placesByCategory[category] = [];
//     }

//     placesByCategory[category].push(place);
//   }

//   return placesByCategory;
// }

export function generatePlacesCategory(places) {
  const placesByCategory = {};

  for (const place of places.features) {
    const category = place.properties.basic_category;

    if (!category) continue;

    if (!placesByCategory[category]) {
      placesByCategory[category] = [];
    }

    placesByCategory[category].push(place);
  }

  return Object.entries(placesByCategory).map(([key, value]) => ({
    key,
    value,
  }));
}
