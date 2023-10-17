import { Router } from "express";
import userModel from "../models/users.models.js";
import { createHash } from "../utils/bcrypt.js";
import passport from "passport";

const userRouter = Router();

// * Register utilizando PASSPORT
userRouter.post("/", passport.authenticate("register"), async (req, res) => {
  try {
    if (!req.user) {
      return res.status(400).send({
        mensaje: "Hubo un problema a registrarte",
        error: "Usuario ya existente",
      });
    }

    return res
      .status(200)
      .send({ mensaje: "Usuario creado correctamente!", payload: req.user });
  } catch (err) {
    return res.status(400).send({
      mensaje: "Hubo un problema al realizar el registro",
      error: err,
    });
  }
});

export default userRouter;
