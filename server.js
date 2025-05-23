import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Servir landing en "/"
app.use("/", express.static(path.join(__dirname, "landing/dist")));

// Servir app en "/app"
app.use("/app", express.static(path.join(__dirname, "app/dist")));

// Fallbacks para Vue Router history mode
app.get("/", (_, res) => {
  res.sendFile(path.join(__dirname, "landing/dist/index.html"));
});
app.get("/app/*", (_, res) => {
  res.sendFile(path.join(__dirname, "app/dist/index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));
