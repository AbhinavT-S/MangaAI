console.log("generator.js loaded");

document.addEventListener("DOMContentLoaded", () => {
    const generateBtn = document.getElementById("generateBtn");

    generateBtn.addEventListener("click", async () => {

        const characterPrompt = document.getElementById("characterPrompt")?.value.trim();
        const backgroundPrompt = document.getElementById("backgroundPrompt")?.value.trim();
        
        // Collect all panel prompts from the grid
        const panelInputs = document.querySelectorAll(".panel-prompt-input");
        const panelActions = Array.from(panelInputs).map(input => input.value.trim());

        if (!characterPrompt || !backgroundPrompt || panelActions.every(p => !p)) {
            alert("Please enter character, background, and at least one panel prompt.");
            return;
        }

        generateBtn.innerText = "Generating...";
        generateBtn.disabled = true;

        try {
            // ✅ Get saved panel layout to determine image dimensions
            const savedLayout = JSON.parse(localStorage.getItem("mangaPanelLayout")) || [];
            
            // ✅ Generate a consistent seed for character consistency
            const characterSeed = Math.floor(Math.random() * 4294967295);
            
            const images = [];
            const finalPrompts = [];

            for (let i = 0; i < panelActions.length; i++) {
                const action = panelActions[i] || "standing"; // Default action if empty
                const userNegative = document.getElementById("negativePrompt")?.value || "";

                // ✅ CONSTRUCT PROMPT: Character + Background + Specific Action + Style
                const finalPrompt = `(${characterPrompt}:1.3), ${backgroundPrompt}, ${action}, ${LOCKED_STYLE}`;
                finalPrompts.push(finalPrompt);

                // Calculate image dimensions based on panel layout
                let width = 512;
                let height = 768;
                
                if (savedLayout && savedLayout[i]) {
                    const layout = savedLayout[i];
                    // Canvas is 400x600px, calculate actual pixel dimensions
                    const canvasWidth = 400;
                    const canvasHeight = 600;
                    
                    const panelWidth = (layout.width / 100) * canvasWidth;
                    const panelHeight = (layout.height / 100) * canvasHeight;
                    
                    // Scale up for better quality (multiply by 2)
                    width = Math.round(panelWidth * 2);
                    height = Math.round(panelHeight * 2);
                    
                    // Ensure dimensions are divisible by 8 (SD requirement)
                    width = Math.round(width / 8) * 8;
                    height = Math.round(height / 8) * 8;
                    
                    // Clamp to reasonable limits
                    width = Math.max(256, Math.min(width, 1024));
                    height = Math.max(256, Math.min(height, 1024));
                }

                const res = await fetch("http://localhost:3000/generate", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        prompt: finalPrompt,
                        negative_prompt: `${LOCKED_NEGATIVE}, ${userNegative}`,
                        width: width,
                        height: height,
                        steps: 25,
                        seed: characterSeed
                    }),
                });

                if (!res.ok) {
                    throw new Error("Backend error");
                }

                const data = await res.json();
                images.push("data:image/png;base64," + data.images[0]);
            }

            // ✅ STORE DATA
            localStorage.setItem("mangaPanels", panelActions.length);
            localStorage.setItem("mangaImages", JSON.stringify(images));
            localStorage.setItem("mangaPanelPrompts", JSON.stringify(finalPrompts));
            
            // Store consistency data
            localStorage.setItem("mangaSeed", characterSeed);
            localStorage.setItem("mangaNegative", document.getElementById("negativePrompt")?.value || "");

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
const LOCKED_STYLE =
    "Japanese manga panel, pure black and white, high contrast ink, sharp clean line art, cinematic framing";

const LOCKED_NEGATIVE =
    "color, colored, grayscale, blurry, soft shading, " +
    "realistic, photorealistic, western comic, 3d render";



