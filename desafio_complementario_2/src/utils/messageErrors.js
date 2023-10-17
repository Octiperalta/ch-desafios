import passport from "passport";

// * Funcion general para retornar errores en las estrategias de password
export const passportError = strategy => {
  return async (req, res, next) => {
    passport.authenticate(strategy, (error, user, info) => {
      if (error) {
        return next(error);
      }

      if (!user) {
        return res
          .status(401)
          .send({ error: info.messages ? info.messages : info.toString() }); // ? Si me envia info.messages, muesto la respuesta que me enviaron. Si no, muestro el objeto info pasado a string (esto porque por ej GitHub envia un objeto de error)
      }

      req.user = user.user;
      next();
    })(req, res, next); // ? Esto ultimo se pone porque es Middleware
  };
};

// * Verificacion de lo privelgios del usuario para acceder a algun recurso
export const authorization = role => {
  return async (req, res, next) => {
    // ? Por las dudas verificamos si existe el usuario ya que por ej el token puede expirar
    if (!req.user) {
      return res.status(401).send({ error: "Usuario no autorizado" });
    }

    if (req.user.role != role) {
      // Si no coincide con el rol
      return res
        .status(403)
        .send({ error: "Usuario no posee los privlegios suficientes" });
    }

    next();
  };
};
