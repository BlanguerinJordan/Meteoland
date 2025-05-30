// On importe Express pour créer un routeur d'API
import express from "express";

// Importation des routes internes (commentées car non utilisées actuellement)
// import me from "./me.js";
// import login from "./login.js";
// import signup from "./signup.js";
// import logout from "./logout.js";
// import addFavorite from "./addFavorite.js";
// import getFavorite from "./getFavorite.js";

// Importation des handlers pour les routes météo et ville
import weather from "./weather.js";
import city from "./city.js";

// Création du routeur Express
const router = express.Router();

// Déclaration des routes internes (non utilisées pour l'instant)
// router.post("/me", me);
// router.post("/login", login);
// router.post("/signup", signup);
// router.post("/logout", logout);
// router.post("/addFavorite", addFavorite);
// router.post("/getFavorite", getFavorite);

// Déclaration des routes vers les API externes (météo et ville)
router.post("/weather", weather);
router.post("/city", city);

// Exportation du routeur pour être utilisé dans le serveur principal
export default router;
