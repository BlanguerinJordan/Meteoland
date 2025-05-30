// Importation des modules nécessaires
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

// Création du routeur Express
const router = express.Router();

// Détermination du chemin absolu du répertoire courant
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Définition du chemin vers le dossier des vues (fichiers HTML)
const viewsPath = path.join(__dirname, '../views');

// Route pour la page d'accueil
router.get('/', (req, res) => {
  res.sendFile(path.join(viewsPath, 'index.html'));
});

// Route pour la page de connexion (non utilisée actuellement)
// router.get('/login', (req, res) => {
//   res.sendFile(path.join(viewsPath, 'login.html'));
// });

// Route pour la page utilisateur (non utilisée actuellement)
// router.get('/user', (req, res) => {
//   res.sendFile(path.join(viewsPath, 'user.html'));
// });

// Exportation du routeur pour l'utiliser dans app.js
export default router;
