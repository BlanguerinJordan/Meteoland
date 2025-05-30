import { ironSession } from "iron-session/express";
import dotenv from "dotenv";
dotenv.config();
//non utilisé pour l'instant

// const sessionOptions = {
//   password: process.env.SESSION_SECRET,
//   cookieName: process.env.COOKIE_NAME,
//   cookieOptions: {
//     secure: process.env.NODE_ENV === "production",
//     httpOnly: true,
//     sameSite: "lax",
//   }
// };
// export default function applySession(req, res) {
//   return new Promise((resolve, reject) => {
//     ironSession(sessionOptions)(req, res, (err) => {
//       if (err) reject(err);
//       else resolve();
//     });
//   });
// }
