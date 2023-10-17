import { Router } from "express";
import passport from "passport";
import { passportError, authorization } from "../utils/messageErrors.js";
import { generateToken } from "../utils/jwt.js";

const sessionRouter = Router();

// * Login utilizando PASSPORT
sessionRouter.post(
  "/login",
  passport.authenticate("login"),
  async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).send({
          mensaje: "No se pudo inciar sesion",
          error: "Contraseña invalida",
        });
      }

      req.session.user = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email,
      };

      const token = generateToken(req.user);

      res.cookie("jwtCookie", token, { maxAge: 43200000 });

      res
        .status(200)
        .send({ mensaje: "Logueado correctamene!", payload: req.user });
    } catch (err) {
      res
        .status(500)
        .send({ mensaje: "Error al inciar sesion", error: `${err}` });
    }
  }
);

sessionRouter.get(
  "/testJWT",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { user } = req.user;

    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      age: req.user.age,
      email: req.user.email,
    };
    res.status(200).send({ message: "Estoy probando JWT", payload: req.user });
  }
);

sessionRouter.get(
  "/current",
  passportError("jwt"),
  authorization("user"),
  (req, res) => {
    res.json(req.user);
  }
);

sessionRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user: email"] }),
  async (req, res) => {
    res
      .status(200)
      .send({ mensaje: "Se realizo el registo con GitHub correctamente!" });
  }
);

sessionRouter.get(
  "/githubSession",
  passport.authenticate("github"),
  async (req, res) => {
    req.session.user = req.user;
    res.status(200).send({ mensaje: "Sesion creada correctamente" });
  }
);

sessionRouter.get("/logout", async (req, res) => {
  if (req.session) {
    req.session.destroy();
  }

  res.clearCookie("jwtCookie");
  res.status(200).json({ mensaje: "Login eliminado" });
});

export default sessionRouter;
