import { Router } from "express";
import userModel from "../models/users.models.js";
import passport from "passport";

const sessionsRouter = Router();

sessionsRouter.get("/login", (req, res) => {
  if (req.session.logged) {
    return res.redirect("/static/products");
  }

  res.render("login");
});

sessionsRouter.post(
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
        role: req.user.role,
      };
      req.session.logged = true;

      // return res.status(200).json({
      //   status: "OK",
      //   message: "Usuario logueado correctamente",
      //   payload: req.user,
      // });

      res.redirect("/static/products");
    } catch (err) {
      return res.status(500).json({
        status: "Error",
        message: "Hubo un error al intentar inciar sesion",
        error: err,
      });
    }
  }
);

sessionsRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user: email"] }),
  async (req, res) => {
    console.log("Se creo el usuario correctamente");

    res
      .status(200)
      .send({
        status: "OK",
        mensaje: "Se realizo el registo con GitHub correctamente!",
      });
  }
);

sessionsRouter.get(
  "/githubSession",
  passport.authenticate("github"),
  async (req, res) => {
    req.session.user = req.user;
    res.status(200).send({ mensaje: "Sesion creada correctamente" });
  }
);

sessionsRouter.post("/logout", (req, res) => {
  if (req.session.logged) {
    // ! No estoy pudiendo borrar la sesion que se crea en Mongo Atlas al realizar el logout
    console.log("Se borra la sesion");
    req.session.destroy();
  }

  res.redirect("/static/login");
});

export default sessionsRouter;
