// Dot sizing — scales proportionally with map width, but never below a minimum
const DOT_BASE_FRAC = 14 / MAP_W;  // target radius for 1 bird at full size
const DOT_STEP_FRAC = 8  / MAP_W;  // added per additional bird at full size
const DOT_BASE_MIN  = 8;           // px floor for 1 bird on small screens
const DOT_STEP_MIN  = 5;           // px floor increment per additional bird

function dotRadius(count, mapWidth) {
  const proportional = (DOT_BASE_FRAC + (count - 1) * DOT_STEP_FRAC) * mapWidth;
  const minimum      =  DOT_BASE_MIN  + (count - 1) * DOT_STEP_MIN;
  return Math.max(proportional, minimum);
}

let activeSeason = "all";
let tooltipShownAt = 0;
const tooltip = document.getElementById("tooltip");
const mapContainer = document.getElementById("map-container");

// Format date as "Month D, YYYY"
function formatDate(d) {
  return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

// Filter records by active season
function getFilteredRecords() {
  if (activeSeason === "all") return RECORDS;
  return RECORDS.filter(r => r.season === activeSeason);
}

// Group filtered records by location, returning { locationKey: [records] }
function groupByLocation(records) {
  const groups = {};
  for (const r of records) {
    if (!groups[r.location]) groups[r.location] = [];
    groups[r.location].push(r);
  }
  return groups;
}

function renderDots() {
  // Remove existing dots
  document.querySelectorAll(".map-dot").forEach(el => el.remove());

  const records = getFilteredRecords();
  const groups = groupByLocation(records);

  for (const [key, birds] of Object.entries(groups)) {
    const loc = LOCATIONS[key];
    const count = birds.length;
    const mapWidth = mapContainer.offsetWidth;
    const radius = dotRadius(count, mapWidth);
    const size = radius * 2;

    const dot = document.createElement("div");
    dot.className = "map-dot";
    dot.style.width  = `${size}px`;
    dot.style.height = `${size}px`;
    dot.style.left   = `${(loc.x / MAP_W) * 100}%`;
    dot.style.top    = `${(loc.y / MAP_H) * 100}%`;
    dot.style.marginLeft = `-${radius}px`;
    dot.style.marginTop  = `-${radius}px`;

    // Attach data for tooltip
    dot._locationLabel = loc.label;
    dot._birds = birds;

    dot.addEventListener("mouseenter", e => showTooltip(e, dot));
    dot.addEventListener("mouseleave", hideTooltip);
    dot.addEventListener("click", e => {
      e.stopPropagation();
      // On mobile, mouseenter fires just before click and already shows the tooltip.
      // Ignore the click if the tooltip was just shown within 300ms to prevent flicker.
      if (Date.now() - tooltipShownAt < 300) return;
      if (tooltip.classList.contains("visible") && tooltip._source === dot) {
        hideTooltip();
      } else {
        showTooltip(e, dot);
      }
    });

    mapContainer.appendChild(dot);

    // Trigger entrance animation on next frame
    requestAnimationFrame(() => {
      requestAnimationFrame(() => dot.classList.add("visible"));
    });
  }

  updateLegend(groups);
}

function showTooltip(e, dot) {
  const entries = dot._birds.map(b =>
    `<div class="tooltip-entry">
      <span class="tooltip-species">${b.species}</span>
      <span class="tooltip-date">${formatDate(b.date)}</span>
    </div>`
  ).join("");
  tooltip.innerHTML = `<strong>${dot._locationLabel}</strong>${entries}`;
  tooltip._source = dot;
  tooltip.classList.add("visible");
  tooltipShownAt = Date.now();
  positionTooltip(e);
}

function hideTooltip() {
  tooltip.classList.remove("visible");
  tooltip._source = null;
}

function positionTooltip(e) {
  const pad = 12;
  const tw = tooltip.offsetWidth;
  const th = tooltip.offsetHeight;
  let x = e.clientX + pad;
  let y = e.clientY + pad;

  // Flip to other side if it would overflow right or bottom
  if (x + tw > window.innerWidth  - pad) x = e.clientX - tw - pad;
  if (y + th > window.innerHeight - pad) y = e.clientY - th - pad;

  // Hard-clamp so it never exits the viewport on any edge
  x = Math.max(pad, Math.min(x, window.innerWidth  - tw - pad));
  y = Math.max(pad, Math.min(y, window.innerHeight - th - pad));

  tooltip.style.left = `${x}px`;
  tooltip.style.top  = `${y}px`;
}

// Keep tooltip positioned while mouse moves over dot
mapContainer.addEventListener("mousemove", e => {
  if (tooltip.classList.contains("visible")) positionTooltip(e);
});

// Dismiss tooltip on outside click (mobile)
document.addEventListener("click", e => {
  if (!e.target.closest(".map-dot")) hideTooltip();
});

function updateLegend(groups) {
  // Determine max count in current view for legend
  const maxCount = Math.max(0, ...Object.values(groups).map(b => b.length));
  const legend = document.getElementById("legend-circles");
  legend.innerHTML = "";

  const mapWidth = mapContainer.offsetWidth;
  const sizes = [1, 2, 3].filter(n => n <= Math.max(maxCount, 1));
  for (const n of sizes) {
    const r = dotRadius(n, mapWidth);
    const wrapper = document.createElement("div");
    wrapper.className = "legend-item";
    const circle = document.createElement("div");
    circle.className = "legend-dot";
    circle.style.width  = `${r * 2}px`;
    circle.style.height = `${r * 2}px`;
    const label = document.createElement("span");
    label.textContent = n === 1 ? "1 bird" : `${n} birds`;
    wrapper.appendChild(circle);
    wrapper.appendChild(label);
    legend.appendChild(wrapper);
  }
}

// Season toggle
const legend = document.querySelector(".legend");

document.querySelectorAll(".season-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".season-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    activeSeason = btn.dataset.season;

    legend.style.opacity = "0";
    setTimeout(() => {
      renderDots();
      requestAnimationFrame(() => { legend.style.opacity = "1"; });
    }, 200);
  });
});

// Re-render dots on resize so sizing stays proportional
let resizeTimer;
window.addEventListener("resize", () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(renderDots, 100);
});

// Initial render
renderDots();
