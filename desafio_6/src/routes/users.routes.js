import { Router } from "express";
import userModel from "../models/users.models.js";
import passport from "passport";

const usersRouter = Router();

// usersRouter.get("/register", (req, res) => {
//   res.render("register");
// });

usersRouter.post(
  "/register",
  passport.authenticate("register"),
  async (req, res) => {
    try {
      if (!req.user) {
        return res.status(400).send({
          mensaje: "Hubo un problema a registrarte",
          error: "Usuario ya existente",
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

      // return res.status(200).send({ mensaje: "Usuario creado" });
      res.redirect("/static/products");
    } catch (err) {
      return res.status(400).send({
        mensaje: "Hubo un problema al realizar el registro",
        error: err,
      });
    }
  }
);

export default usersRouter;
