import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const viewsPath = path.join(__dirname, '../views');

// Page d'accueil
router.get('/', (req, res) => {
  res.sendFile(path.join(viewsPath, 'index.html'));
});

// Page de connexion non utilisée pour l'instant
router.get('/login', (req, res) => {
  res.sendFile(path.join(viewsPath, 'login.html'));
});

// Page utilisateur non utilisée pour l'instant
router.get('/user', (req, res) => {
  res.sendFile(path.join(viewsPath, 'user.html'));
});

export default router;
