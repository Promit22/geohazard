import { Marker } from "maplibre-gl";
import { getOverturePlaces } from "./places";
// export function addMarkers(map, earthquake) {
//   console.log('earthqueake from addMarkers', earthquake);
//   earthquake.features.forEach((marker) => {
//     // create a DOM element for the marker
//     const el = document.createElement('div');
//     el.className = 'marker';
//     el.style.backgroundColor = 'red';
//     el.style.width = `1rem`;
//     el.style.height = `1rem`;

//     // el.addEventListener('click', () => {
//     //   window.alert(marker.properties.message);
//     // });

//     // add marker to map
//     new Marker({ element: el })
//       .setLngLat(marker.geometry.coordinates)
//       .addTo(map);
//   });
// }

// export function addEarthquakeLayer(map, earthquake) {
//   console.log('earthquake from addEarthquakeLayer', earthquake);

//   // 1. Add the GeoJSON data as a source to the map
//   if (!map.getSource('earthquakes')) {
//     map.addSource('earthquakes', {
//       type: 'geojson',
//       data: earthquake // Pass your raw FeatureCollection directly!
//     });
//   } else {
//     // If the function is called again with new data, update it efficiently
//     map.getSource('earthquakes').setData(earthquake);
//   }

//   // 2. Add a circle layer to render all points via WebGL
//   if (!map.getLayer('earthquake-points')) {
//     map.addLayer({
//       id: 'earthquake-points',
//       type: 'circle',
//       source: 'earthquakes',
//       paint: {
//         'circle-radius': 8, // Roughly 1rem (16px diameter)
//         'circle-color': 'red',
//         'circle-stroke-width': 1,
//         'circle-stroke-color': '#ffffff'
//       }
//     });

//     // 3. Handle click events on the layer (replaces individual element listeners)
//     map.on('click', 'earthquake-points', (e) => {
//       const feature = e.features[0];

//       // Access your properties here (e.g., feature.properties.title or message)
//       window.alert(`Earthquake magnitude: ${feature.properties.mag}`);
//     });

//     // Change the cursor to a pointer when hovering over points
//     map.on('mouseenter', 'earthquake-points', () => {
//       map.getCanvas().style.cursor = 'pointer';
//     });
//     map.on('mouseleave', 'earthquake-points', () => {
//       map.getCanvas().style.cursor = '';
//     });
//   }
// }

// addmarkers.js
export async function addEarthquakeLayer(map, earthquake) {
  // 1. Wait until the map style is fully loaded
  if (!map.isStyleLoaded()) {
    await new Promise((resolve) => map.once("style.load", resolve));
  }

  console.log("earthquake from addEarthquakeLayer", earthquake);

  // 2. Add or update source
  if (!map.getSource("earthquakes")) {
    map.addSource("earthquakes", {
      type: "geojson",
      data: earthquake,
    });
  } else {
    map.getSource("earthquakes").setData(earthquake);
  }

  // 3. Add circle layer
  if (!map.getLayer("earthquake-points")) {
    map.addLayer({
      id: "earthquake-points",
      type: "circle",
      source: "earthquakes",
      paint: {
        "circle-radius": 8,
        "circle-color": "red",
        "circle-stroke-width": 1,
        "circle-stroke-color": "#ffffff",
      },
    });

    map.on("click", "earthquake-points", async (e) => {
      // const feature = e.features[0];
      // console.log("current earthquake", feature);

      // console.log("current earthquake", feature);
      // console.log("feature id:", feature.id);
      // console.log("properties:", feature.properties);
      // console.log("geometry:", feature.geometry);
      // window.alert(`Earthquake magnitude: ${feature.properties.mag}`);

      const features = map.queryRenderedFeatures(e.point, {
        layers: ["earthquake-points"],
      });

      if (!features.length) return;

      const feature = features[0];

      const [lng, lat] = feature.geometry.coordinates;

      console.log("Current earthquake:", feature);
      console.log("Coordinates:", lat, lng);

      try {
        const places = await getOverturePlaces(
          lat,
          lng,
          10000, // 10 km
          OVERTURE_API_KEY,
        );
        console.log(places.features.length);

        console.log("Overture response:", places);
        console.log("Number returned:", places.features.length);
      } catch (error) {
        console.error("Failed to get Overture places:", error);
      }
    });

    map.on("mouseenter", "earthquake-points", () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", "earthquake-points", () => {
      map.getCanvas().style.cursor = "";
    });
  }
}
