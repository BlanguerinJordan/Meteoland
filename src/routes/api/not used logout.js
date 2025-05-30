import applySession from '../../lib/session.js';

// export default async function handler(req, res) {
//   if (req.method !== "POST") {
//     return res.status(405).json({ error: "Méthode non autorisée" });
//   }

//   try {
//     await applySession(req,res);
//     await req.session.destroy();
//     res.status(200).json({ message: "Déconnecté" });
//   } catch (err) {
//     console.error("Erreur lors de la déconnexion :", err);
//     res.status(500).json({ error: "Erreur lors de la déconnexion" });
//   }
// }