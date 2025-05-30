// Importation des modules nécessaires
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Importation des routeurs
import pagesRouter from "./routes/pages.js";
import apiRouter from "./routes/api/api.js";

// Chargement des variables d'environnement depuis .env
dotenv.config();

// Création de l'application Express
const app = express();

// Récupération du chemin absolu du dossier courant (car import.meta.url ne donne pas __dirname en ES modules)
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Variables d'environnement
const BASE_PATH = process.env.BASE_PATH;      // ex: "/Meteoland"
const PORT = process.env.PORT_SERVER;         // ex: 3000

// Middlewares pour parser le body des requêtes (JSON ou formulaire)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Déclaration des fichiers statiques (HTML, CSS, JS côté client...)
app.use(BASE_PATH, express.static(path.join(__dirname, "../public")));

// Routes des pages (ex: index.html, login.html, etc.)
app.use(BASE_PATH, pagesRouter);

// Routes de l'API (ex: /api/weather, /api/city, etc.)
app.use("/api", apiRouter);

// Démarrage du serveur
app.listen(PORT, () => {
  console.clear();
  console.log(`Serveur Express lancé sur http://localhost:${PORT}${BASE_PATH}/`);
});
