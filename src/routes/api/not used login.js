import db from '../../lib/db.js';
import applySession from '../../lib/session.js';
import bcrypt from 'bcrypt';

// export default async function handler(req, res) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ error: 'Méthode non autorisée' });
//   }

//   const { email, password } = req.body;

//   if (!email || !password) {
//     return res.status(400).json({ error: 'Email et mot de passe requis' });
//   }

//   try {
//     await applySession(req, res); // 🔥 On injecte la session ici

//     const [rows] = await db.execute('SELECT * FROM userslist WHERE email = ?', [
//       email.toLowerCase().trim(),
//     ]);

//     if (rows.length === 0) {
//       return res.status(401).json({ error: 'E-mail incorrect' });
//     }

//     const user = rows[0];
//     const match = await bcrypt.compare(password, user.password);
//     if (!match) {
//       return res.status(401).json({ error: 'Mot de passe incorrect' });
//     }

//     // On a maintenant req.session
//     req.session.username = user.name;
//     req.session.iduser = user.iduser;
//     await req.session.save();

//     res.json(user);
//   } catch (err) {
//     console.error('Erreur serveur :', err);
//     return res.status(500).json({ error: 'Erreur serveur interne' });
//   }
// }
