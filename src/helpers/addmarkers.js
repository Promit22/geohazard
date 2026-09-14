export async function addEarthquakeLayer(map, earthquake) {
  // 1. Wait until the map style is fully loaded
  // if (!map.isStyleLoaded()) {
  //   await new Promise((resolve) => {
  //     map.once("style.load", resolve);
  //     console.log("marker success");
  //   });
  // } else {
  //   console.log("marker failed");
  // }

  console.log("earthquake from addEarthquakeLayer", earthquake);

  // 2. Add or update source
  if (!map.getSource("earthquakes")) {
    console.log("source available");

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
        "circle-radius": [
          "interpolate",
          ["linear"],
          ["get", "mag"],
          3,
          5,
          5,
          8,
          7,
          13,
          9,
          18,
        ],
        "circle-color": [
          "step",
          ["get", "mag"],
          "#22c55e",
          4,
          "#eab308",
          5,
          "#f97316",
          6,
          "#ef4444",
          7,
          "#991b1b",
        ],
        "circle-stroke-width": 1,
        "circle-stroke-color": "#ffffff",
      },
    });

    map.on("mouseenter", "earthquake-points", () => {
      map.getCanvas().style.cursor = "pointer";
    });
    map.on("mouseleave", "earthquake-points", () => {
      map.getCanvas().style.cursor = "";
    });
  } else {
    console.log("did not work");
  }
}
