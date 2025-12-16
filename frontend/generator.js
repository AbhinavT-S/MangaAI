console.log("generator.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  const generateBtn = document.getElementById("generateBtn");

  generateBtn.addEventListener("click", async () => {
    const story = document.getElementById("myText").value.trim();
    const panels = parseInt(document.getElementById("layoutSelect").value);

    if (!story) {
      alert("Enter a prompt");
      return;
    }

    generateBtn.innerText = "Generating...";
    generateBtn.disabled = true;

    try {
      // ✅ STORY → N PANEL PROMPTS
      const panelPrompts = storyToPanels(story, panels);

      const images = [];

      for (let i = 0; i < panelPrompts.length; i++) {
        const res = await fetch("http://localhost:3000/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: panelPrompts[i],
            width: 512,
            height: 768,
            steps: 25
          }),
        });

        if (!res.ok) {
          throw new Error("Backend error");
        }

        const data = await res.json();
        images.push("data:image/png;base64," + data.images[0]);
      }

      // ✅ STORE DATA
      localStorage.setItem("mangaPanels", panels);
      localStorage.setItem("mangaImages", JSON.stringify(images));
      localStorage.setItem(
        "mangaPanelPrompts",
        JSON.stringify(panelPrompts)
      );

      // ✅ GO TO EDITOR
      window.location.href = "editor.html";

    } catch (err) {
      console.error(err);
      alert("Generation failed. Is backend + SD running?");
      generateBtn.innerText = "Generate Panels";
      generateBtn.disabled = false;
    }
  });
});

/* ================= STORY → PANELS ================= */

function storyToPanels(story, panels) {
  const focus = [
    "wide establishing shot, background focused",
    "character action, dynamic pose, motion lines",
    "close-up on face, strong emotion",
    "dramatic angle, intense lighting",
    "cinematic composition, deep shadows",
    "final scene, emotional climax"
  ];

  return Array.from({ length: panels }, (_, i) =>
    `${story}, ${focus[i] || "manga panel"}, black and white manga style, clean line art`
  );
}
