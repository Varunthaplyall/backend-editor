const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const { runInDocker } = require("./utils/dockerRunner");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors( {
    origin: "https://editor-frontend-zeta.vercel.app"
}));
app.use(express.json());

app.post('/submit', async (req, res) => {
    const { language_id, source_code, stdin } = req.body;
    console.log(req.body);

    if (!language_id || !source_code) {
        return res.status(400).json({ error: "Missing fields" });
    }

    try {
        const result = await runInDocker({ language_id, source_code, stdin });
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, ()=>{
    console.log(`Server is running on port http://localhost:${PORT}`);
})
