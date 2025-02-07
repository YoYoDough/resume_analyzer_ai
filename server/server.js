const express = require("express");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

app.post("/analyze", async (req, res) => {
    const { videoURL } = req.body;
    const result = await analyzeVideo(videoURL)
    res.json(result)
})

app.listen(5000, () => console.log("Server running on port 5000..."))