import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import "dotenv/config";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static("public"));

app.get("/pokemon_placeholder.json", (_req, res) => {
  res.sendFile(path.join(__dirname, "pokemon_placeholder.json"));
});

const port = Number(process.env.PORT);
app.listen(port, () => {
  console.log(`Frontend @ http://localhost:${port}`);
});
