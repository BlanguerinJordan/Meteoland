import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import pagesRouter from "./routes/pages.js";
import apiRouter from "./routes/api/api.js";
dotenv.config();

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const BASE_PATH = process.env.BASE_PATH;
const PORT = process.env.PORT_SERVER;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Fichiers statiques (CSS, JS client...)
app.use(BASE_PATH, express.static(path.join(__dirname, "../public")));

// Routes pages HTML (index, login, user)
app.use(BASE_PATH, pagesRouter);

// API Router 
app.use("/api", apiRouter);

// Lancement du serveur
app.listen(PORT, () => {
  console.clear();
  console.log(
    `Serveur Express lancé sur http://localhost:${PORT}${BASE_PATH}/`
  );
  
});
