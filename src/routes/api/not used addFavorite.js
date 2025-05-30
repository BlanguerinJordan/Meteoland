import db from "../../lib/db.js";
import applySession from "../../lib/session.js";

// export default async function handler(req, res) {
//   if (req.method !== "POST")
//     return res.status(405).json({ error: "Méthode non autorisée" });

//   await applySession(req, res);
//   const idUser = req.session.iduser;

//   if (!idUser) return res.status(401).json({ error: "Non connecté" });

//   const { cityCode, } = req.body;
//   if (!cityCode) return res.status(400).json({ error: "cityCode introuvable" });

//   try {
//     const [result] = await db.execute(
//       "INSERT INTO meteofav(codemeteo,iduser) VALUE (?,?)",
//       [cityCode, idUser]
//     );
//     res
//       .status(200)
//       .json({
//         message: "Ville ajouté aux favoris",
//         id: result.insertId,
//         favoris: cityCode,
//       });
//   } catch (err) {
//     console.error("Erreur lors de l'ajout de la ville dans les favoris ", err);
//     res.status(500).json({ error: "Erreur serveur" });
//   }
// }
