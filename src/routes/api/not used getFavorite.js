import applySession from "../../lib/session.js";
import db from "../../lib/db.js";

// export default async function handler(req, res) {
//   if (req.method !== "POST")
//     return res.status(405).json({ error: "Méthode non autorisée" });

//   try {
//     await applySession(req, res);
//     const iduser = req.session.iduser;
//     console.log(iduser);
//     const [rows] = await db.execute("SELECT * FROM meteofav WHERE iduser = ?", [
//       iduser,
//     ]);
//     console.log(rows);
//     if (rows.length === 0)
//       return res.status(401).json({ error: "La liste des favoris est vide" });

//     res.json(rows);
//   } catch (err) {
//     console.error("Erreur dans /api/getFavorite :", err);
//     res.status(500).json({ error: "Erreur serveur interne" });
//   }
// }
