const dynamicContainer = document.getElementById("dynamic");

export function renderEarthquakeInputs() {
  if (!dynamicContainer) return;

  // Clear existing content
  dynamicContainer.replaceChildren();

  // 1. Radius Input Group
  // const radiusGroup = document.createElement("div");
  // radiusGroup.className = "input-group";

  // const radiusLabel = document.createElement("label");
  // radiusLabel.htmlFor = "limit";
  // radiusLabel.textContent = "limit";

  // const selectWrapper = document.createElement("div");
  // selectWrapper.className = "select-wrapper";

  // const radiusInput = document.createElement("input");
  // radiusInput.type = "number";
  // radiusInput.id = "limit";
  // radiusInput.name = "limit";
  // radiusInput.placeholder = "limit the number of earthquake default 100";
  // // radiusInput.value = 10;

  // const unitSelect = document.createElement("select");
  // unitSelect.id = "radius-unit";
  // unitSelect.name = "radius-unit";

  // const optionKm = new Option("KM", "km", true, true);
  // const optionDeg = new Option("DEG", "deg");
  // unitSelect.append(optionKm, optionDeg);

  // selectWrapper.append(radiusInput, unitSelect);
  // radiusGroup.append(radiusLabel, selectWrapper);

  // 2. Magnitude Input Group
  const magGroup = document.createElement("div");
  magGroup.className = "input-group";

  const magLabel = document.createElement("label");
  magLabel.htmlFor = "magnitude";
  magLabel.textContent = "Magnitude";

  const magInput = document.createElement("input");
  magInput.type = "text";
  magInput.id = "magnitude";
  magInput.placeholder = "intensity of the earthquake. default 5";
  magInput.name = "magnitude";
  // magInput.value = 5;

  magGroup.append(magLabel, magInput);

  const limitGroup = document.createElement("div");
  limitGroup.className = "input-group";

  const limitLabel = document.createElement("label");
  limitLabel.htmlFor = "limit";
  limitLabel.textContent = "Limit";

  const limitInput = document.createElement("input");
  limitInput.type = "number";
  limitInput.id = "limit";
  limitInput.placeholder = "limit of earthquakes eg. 500. default 500";
  limitInput.name = "limit";
  // magInput.value = 5;

  limitGroup.append(limitLabel, limitInput);

  // Append both to the container
  dynamicContainer.append(magGroup, limitGroup);
}

export function renderFloodInputs() {
  dynamicContainer.replaceChildren();
}
