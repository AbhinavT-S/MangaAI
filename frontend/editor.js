

images.forEach((src, index) => {
  const panel = document.createElement("div");

  panel.className =
    "relative border-2 border-black bg-white cursor-pointer";

  panel.dataset.index = index;

  panel.innerHTML = `
    <img src="${src}"
         class="w-full h-full object-cover grayscale contrast-125" />
  `;

  panelGrid.appendChild(panel);

  panel.addEventListener("click", () => {
    document.querySelectorAll(".panel-selected")
      .forEach(p => p.classList.remove("panel-selected"));

    panel.classList.add("panel-selected");
    selectedPanel = panel;
  });
});








