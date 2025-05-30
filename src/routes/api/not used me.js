import applySession from '../../lib/session.js';
// non utilisé pour l'instant
// export default async function handler(req, res) {
//   try {
//     await applySession(req, res); // Injecte req.session

//     if (req.session.username && req.session.iduser) {
//       res.status(200).json({
//         user: req.session.username,
//         iduser: req.session.iduser
//       });
//     } else {
//       res.status(401).json({ error: 'Non connecté' });
//     }
//   } catch (err) {
//     console.error('Erreur dans /api/me :', err);
//     res.status(500).json({ error: 'Erreur serveur interne' });
//   }
// }