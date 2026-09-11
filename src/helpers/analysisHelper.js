const dynamicContainer = document.getElementById("dynamic");

export function renderEarthquakeInputs() {
  if (!dynamicContainer) return;

  // Clear existing content
  dynamicContainer.replaceChildren();

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

export function renderCardDetails(target, titleText, kvPairs = []) {
  // 1. Resolve container reference (supports both element reference and CSS selector)
  const container = document.getElementById(target);
  console.log(target, container);

  if (!container) {
    console.error("renderCardDetails: Target container element not found.");
    return;
  }

  // 2. Clear existing content safely
  container.replaceChildren();

  // 3. Create the Header Element
  let header;
  if (titleText) {
    header = document.createElement("h2");
    header.className = "card-header";
    header.textContent = titleText;
    container.appendChild(header);
  }

  const dl = document.createElement("dl");
  dl.className = "kv-list";

  // 5. Use a DocumentFragment to batch DOM inserts (improves performance)
  const fragment = document.createDocumentFragment();

  kvPairs.forEach(({ key, value }) => {
    const pairDiv = document.createElement("div");
    pairDiv.className = "kv-pair";

    const dt = document.createElement("dt");
    dt.className = "kv-key";
    dt.textContent = key;

    const dd = document.createElement("dd");
    dd.className = "kv-value";
    dd.textContent = value;

    pairDiv.append(dt, dd);
    fragment.appendChild(pairDiv);
  });

  // 6. Append elements to the DOM
  dl.appendChild(fragment);
  container.append(dl);
}

export function renderCollapsibleCard(
  target,
  titleText,
  primaryItems = [],
  hiddenItems = [],
) {
  // 1. Resolve container reference
  const container = document.getElementById(target);

  if (!container) {
    console.error("renderCollapsibleCard: Target element not found.");
    return;
  }

  // 2. Clear existing content safely
  container.replaceChildren();

  // 3. Create Header
  const header = document.createElement("h2");
  header.className = "card-header";
  header.textContent = titleText;

  // 4. Create Primary (Always Visible) List
  const primaryList = createKvList(primaryItems, null, true);
  container.append(header, primaryList);

  // If there are no hidden items, stop here and render as a plain card
  if (!hiddenItems || hiddenItems.length === 0) {
    return;
  }

  // --- THE CATCH: Generate a unique ID for the Checkbox & Label link ---
  // const uniqueToggleId = `toggle-${container.id || Math.random().toString(36).substring(2, 9)}`;

  // 5. Create Checkbox Input
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = "card-toggle-1";
  checkbox.className = "toggle-checkbox";

  // 6. Create Accordion Wrapper Structure
  const accordionWrapper = document.createElement("div");
  accordionWrapper.className = "accordion-wrapper";

  const accordionInner = document.createElement("div");
  accordionInner.className = "accordion-inner";

  const hiddenList = createKvList(hiddenItems, "extra-padding");

  accordionInner.appendChild(hiddenList);
  accordionWrapper.appendChild(accordionInner);

  // 7. Create Label Button
  const label = document.createElement("label");
  label.htmlFor = "card-toggle-1"; // Links label to the unique checkbox ID
  label.className = "accordion-btn";

  const spanMore = document.createElement("span");
  spanMore.className = "txt-more";
  spanMore.textContent = "Show More Details";

  const spanLess = document.createElement("span");
  spanLess.className = "txt-less";
  spanLess.textContent = "Show Less";

  const chevron = document.createElement("span");
  chevron.className = "chevron";
  chevron.textContent = "›";

  label.append(spanMore, spanLess, chevron);

  // 8. Append collapsible elements to the card
  container.append(checkbox, accordionWrapper, label);
}

export function generateEarthquakeKv(ear, dept) {
  return [
    {
      key: "Place",
      value: ear["properties"]["place"],
    },
    {
      key: "Magnitude",
      value: ear["properties"]["mag"],
    },
    {
      key: "Depth",
      value: `${dept ? dept : "unavailable"} ${dept ? "KM" : ""}`,
    },
    // {
    //   key: "Time",
    //   value: formatDate(ear["properties"]["time"]),
    // },
    {
      key: "Tsunami",
      value: ear["properties"]["tsunami"],
    },
  ];
}

function createKvList(items, extraClass = "", primary) {
  const dl = document.createElement("dl");
  dl.className = `kv-list ${extraClass}`.trim();

  const fragment = document.createDocumentFragment();

  items.forEach(({ key, value }) => {
    const pairDiv = document.createElement("div");
    pairDiv.className = "kv-pair";

    const dt = document.createElement("dt");
    dt.className = "kv-key";
    dt.textContent = normalizeText(key);

    const dd = document.createElement("dd");
    dd.className = "kv-value";
    dd.textContent = primary ? value : value.length;

    pairDiv.append(dt, dd);
    fragment.appendChild(pairDiv);
  });

  dl.appendChild(fragment);
  return dl;
}

function normalizeText(text) {
  if (typeof text !== "string" || !text.trim()) return "";

  return text
    .split("_")
    .filter(Boolean) // Ignores extra or trailing underscores
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function createAccordionLabel(toggleId = "1") {
  const label = document.createElement("label");
  label.setAttribute("for", `card-toggle-${toggleId}`);
  label.className = "accordion-btn";

  const txtMore = document.createElement("span");
  txtMore.className = "txt-more";
  txtMore.textContent = "Show More Details";

  const txtLess = document.createElement("span");
  txtLess.className = "txt-less";
  txtLess.textContent = "Show Less";

  const chevron = document.createElement("span");
  chevron.className = "chevron";
  chevron.textContent = "›";

  label.append(txtMore, txtLess, chevron);

  return label;
}

// Example usage:
// document.body.appendChild(createAccordionLabel(1));
