const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/generate", async (req, res) => {
  try {
    const { prompt, width, height, steps } = req.body;

    const response = await axios.post(
      "http://127.0.0.1:7860/sdapi/v1/txt2img",
      {
        prompt,
        negative_prompt: "color, blurry, low contrast, realism",
        width: width || 512,
        height: height || 768,
        steps: steps || 24,
        cfg_scale: 7,
        sampler_name: "DPM++ 2M",
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Generation failed" });
  }
});

app.listen(3000, () =>
  console.log("✅ Backend running on http://localhost:3000")
);
