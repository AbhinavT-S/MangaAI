console.log("generator.js loaded");

document.addEventListener("DOMContentLoaded", () => {
    const generateBtn = document.getElementById("generateBtn");

    generateBtn.addEventListener("click", async () => {

        const characterPrompt = document.getElementById("characterPrompt")?.value.trim();
        const story = document.getElementById("myText").value.trim();
        const panels = parseInt(document.getElementById("layoutSelect").value);

        if (!characterPrompt || !story) {
            alert("Enter both character and story prompt");
            return;
        }

        generateBtn.innerText = "Generating...";
        generateBtn.disabled = true;

        try {
            // ✅ Get saved panel layout to determine image dimensions
            const savedLayout = JSON.parse(localStorage.getItem("mangaPanelLayout")) || [];
            
            // ✅ Generate a consistent seed for character consistency
            const characterSeed = Math.floor(Math.random() * 4294967295);
            
            // ✅ STORY → N PANEL PROMPTS
            const panelPrompts = storyToPanels(characterPrompt, story, panels);

            const images = [];

            for (let i = 0; i < panelPrompts.length; i++) {
                const userNegative = document.getElementById("negativePrompt")?.value || "";

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
                        prompt: panelPrompts[i],
                        negative_prompt: `${LOCKED_NEGATIVE}, ${userNegative}`,
                        width: width,
                        height: height,
                        steps: 25,
                        seed: characterSeed  // Same seed for all panels = consistent character
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
const LOCKED_STYLE =
    "pure black and white manga, japanese manga style, ink drawing, " +
    "high contrast, sharp clean ink lines, no shading, no grayscale, " +
    "panel composition, cinematic framing";

const LOCKED_NEGATIVE =
    "color, colored, grayscale, blurry, soft shading, " +
    "realistic, photorealistic, western comic, 3d render";


/* ================= STORY → PANELS ================= */

function storyToPanels(character, story, panels) {
    // Generate narrative beats based on the story
    const beats = generateStoryBeats(story, panels);
    
    // Enhanced character description with emphasis for consistency
    const characterDesc = `(${character}:1.3), consistent character, same person throughout`;

    return Array.from({ length: panels }, (_, i) => {
        return `${characterDesc}, ${beats[i]}, Japanese manga panel, pure black and white, high contrast ink, sharp clean line art, cinematic framing`;
    });
}

/**
 * Intelligently breaks down a story into sequential narrative beats
 * @param {string} story - The main story/scenario
 * @param {number} panelCount - Number of panels to generate
 * @returns {string[]} Array of narrative beats for each panel
 */
function generateStoryBeats(story, panelCount) {
    // Common narrative structures for different panel counts
    const storyTemplates = {
        1: (s) => [s],
        
        2: (s) => [
            `${s}, beginning of the scene`,
            `${s}, conclusion or reaction`
        ],
        
        3: (s) => [
            `${s}, establishing shot, scene begins`,
            `${s}, action intensifies, middle of scene`,
            `${s}, climax or resolution`
        ],
        
        4: (s) => [
            `${s}, wide establishing shot`,
            `${s}, character reacts, tension builds`,
            `${s}, peak moment, dramatic action`,
            `${s}, aftermath, emotional response`
        ],
        
        5: (s) => [
            `${s}, calm before, setting the scene`,
            `${s}, initial action begins`,
            `${s}, tension escalates, close-up reaction`,
            `${s}, climactic moment, dramatic peak`,
            `${s}, resolution, emotional conclusion`
        ]
    };

    // Use template if available, otherwise create dynamic progression
    if (storyTemplates[panelCount]) {
        return storyTemplates[panelCount](story);
    }

    // For other panel counts, create a progression
    return Array.from({ length: panelCount }, (_, i) => {
        const progress = i / (panelCount - 1);
        if (progress < 0.33) {
            return `${story}, beginning, establishing the scene`;
        } else if (progress < 0.66) {
            return `${story}, action progresses, tension builds`;
        } else {
            return `${story}, climax and resolution`;
        }
    });
}



