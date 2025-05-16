const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const { submitCode } = require("./utils");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors( {
    origin: "http://localhost:5173"
}));
app.use(express.json());

app.post("/submit", async (req, res)=>{
    console.log(req.body);
    const data = req.body;
    if (!data.language_id || !data.source_code) {
        return res.status(400).json({ error: "language_id and source_code are required" });
    }
    try {
        const response = await submitCode(data);
        res.json(response);
        console.log(response);
    } catch (error) {
        console.log(error);
    }
})

app.listen(PORT, ()=>{
    console.log(`Server is running on port http://localhost:${PORT}`);
})