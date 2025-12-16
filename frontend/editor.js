
const panelGrid = document.getElementById("panelGrid");

const panels = parseInt(localStorage.getItem("mangaPanels")) || 4;
const images = JSON.parse(localStorage.getItem("mangaImages")) || [];

function getGrid(count) {
  if (count == 1) return "grid-cols-1 grid-rows-1";
  if (count == 2) return "grid-cols-1 grid-rows-2";
  if (count == 3) return "grid-cols-1 grid-rows-3";
  if (count == 4) return "grid-cols-2 grid-rows-2";
  if (count == 6) return "grid-cols-2 grid-rows-3";
}

panelGrid.className = "grid gap-2 p-4 bg-white " + getGrid(panels);
panelGrid.style.height = "auto"; // optional, but safe



images.forEach(src => {
  const panel = document.createElement("div");
  panel.className = "relative border-2 border-black overflow-hidden aspect-[4/5]";


  panel.innerHTML = `
    <img src="${src}" class="w-full h-full object-cover grayscale contrast-125"/>
  `;

  panelGrid.appendChild(panel);
});

