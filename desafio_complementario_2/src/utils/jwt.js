import "dotenv/config.js"; // ? Permite utilzar variables de entorno
import jwt from "jsonwebtoken";

export const generateToken = user => {
  /* 
    1) Parametro: Objeto asociado al token
    2) Param: clave privada para el cifrado
    3) Param: tiempo de expiracion
  */
  const token = jwt.sign({ user }, process.env.JWT_SECRET, {
    expiresIn: "12h",
  });

  return token;
};

export const authToken = (req, res, next) => {
  const authHeader = req.headers.Authorization;

  if (!authHeader) {
    return res.status(401).send({ error: "Usuario no autenticado" });
  }

  const token = authHeader.split(" ")[1]; // Separo el token del'Bearer'

  jwt.sign(token, process.env.JWT_SECRET, (error, credentials) => {
    if (error) {
      return res.status(403).send({ error: "Usuario no autorizado" });
    }

    // Descifro el token
    req.user = credentials.user;
    next();
  });
};

// console.log(
// generateToken({
// _id: { $oid: "6518e38d2f2c891c850841d1" },
// first_name: "passport",
// last_name: "prueba",
// email: "passport@test.com",
// password: "$2b$15$20GrskfwksixecMcAos.CustLKjSkaK07vTyHTVhZj6v.gbjx776m",
// age: { $numberInt: "123" },
// role: "user",
// __v: { $numberInt: "0" },
// })
// );

// console.log(
//   generateToken({
//     _id: { $oid: "650f84a17341886fe8808793" },
//     first_name: "Octavio",
//     last_name: "Peralta",
//     email: "octa@peralta.com",
//     password: "$2b$10$NxBT1B3qSfFiSSbAWdLCu.Pq1aPx/aPQpW9BqcsMqYJw997196LeG",
//     age: { $numberInt: "23" },
//     __v: { $numberInt: "0" },
//     role: "admin",
//   })
// );
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7Il9pZCI6eyIkb2lkIjoiNjUxOGUzOGQyZjJjODkxYzg1MDg0MWQxIn0sImZpcnN0X25hbWUiOiJwYXNzcG9ydCIsImxhc3RfbmFtZSI6InBydWViYSIsImVtYWlsIjoicGFzc3BvcnRAdGVzdC5jb20iLCJwYXNzd29yZCI6IiQyYiQxNSQyMEdyc2tmd2tzaXhlY01jQW9zLkN1c3RMS2pTa2FLMDd2VHlIVFZoWmo2di5nYmp4Nzc2bSIsImFnZSI6eyIkbnVtYmVySW50IjoiMTIzIn0sInJvbGUiOiJ1c2VyIiwiX192Ijp7IiRudW1iZXJJbnQiOiIwIn19LCJpYXQiOjE2OTc0MTEyNzYsImV4cCI6MTY5NzQ1NDQ3Nn0.6T8sneTOCgrtoTTMqMm6kaQ2roTeAXLuHdLJK-vr2gk
