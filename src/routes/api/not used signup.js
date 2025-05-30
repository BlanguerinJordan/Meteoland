import db from '../../lib/db.js';
import bcrypt from 'bcrypt';
import applySession from '../../lib/session.js';
// export default async function handler(req, res) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ error: 'Méthode non autorisée' });
//   }

//   const { email, name, password } = req.body;

//   if (!email || !name || !password) {
//     return res.status(400).json({ error: 'Tous les champs sont requis' });
//   }

//   try {
//     await applySession(req, res); // Injecte req.session

//     // Vérifie si l'email est déjà utilisé
//     const [existing] = await db.execute(
//       'SELECT * FROM userslist WHERE email = ?',
//       [email.toLowerCase().trim()]
//     );

//     if (existing.length > 0) {
//       return res.status(409).json({ error: 'Email déjà utilisé' });
//     }

//     const saltRounds = parseInt(process.env.SALT_ROUNDS);
//     const hashedPassword = await bcrypt.hash(password, saltRounds);

//     // Insère le nouvel utilisateur
//     const [result] = await db.execute(
//       'INSERT INTO userslist(email, name, password) VALUES (?, ?, ?)',
//       [email.toLowerCase().trim(), name, hashedPassword]
//     );

//     // Initialise la session après création
//     req.session.username = name;
//     req.session.iduser = result.insertId;
//     await req.session.save();

//     res.json({ iduser: result.insertId, name });
//   } catch (err) {
//     console.error('Erreur serveur :', err);
//     return res.status(500).json({ error: 'Erreur serveur interne' });
//   }
// }
