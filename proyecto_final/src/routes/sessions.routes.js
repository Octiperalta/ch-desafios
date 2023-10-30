import { Router } from "express";
import passport from "passport";
import { passportError, authorization } from "../utils/messageErrors.js";
import { generateToken } from "../utils/jwt.js";
import { login, logout } from "../controllers/sessions.controller.js";

const sessionRouter = Router();

// * Login utilizando PASSPORT
sessionRouter.post("/login", passport.authenticate("login"), login);

/*
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
*/

sessionRouter.get(
  "/current",
  passportError("jwt"),
  authorization("admin"),
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

sessionRouter.get("/logout", logout);

export default sessionRouter;
