import express from "express";
// import me from "./me.js";
// import login from "./login.js";
// import signup from "./signup.js";
// import logout from "./logout.js";
// import addFavorite from "./addFavorite.js";
// import getFavorite from "./getFavorite.js";
import weather from "./weather.js";
import city from "./city.js";

const router = express.Router();

// Routes POST de l'API interne non utilisées pour l'instant
// router.post("/me", me);
// router.post("/login", login);
// router.post("/signup", signup);
// router.post("/logout", logout);
// router.post("/addFavorite", addFavorite);
// router.post("/getFavorite", getFavorite);

// API Externe
router.post("/weather", weather);
router.post("/city",city);


export default router;
