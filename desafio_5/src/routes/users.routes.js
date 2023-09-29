import { Router } from "express";
import userModel from "../models/users.models.js";

const usersRouter = Router();

// usersRouter.get("/register", (req, res) => {
//   res.render("register");
// });

usersRouter.post("/register", async (req, res) => {
  const { first_name, last_name, email, password, age } = req.body;

  try {
    const response = await userModel.create({
      first_name,
      last_name,
      email,
      password,
      age,
    });

    req.session.username = response.first_name;
    req.session.userRole = response.role;
    req.session.logged = true;

    res.redirect("/static/products");
  } catch (err) {
    // res.render("register", {
    // error: "Mensaje de error que deberia ser mostrado por la vista",
    // });

    res.status(400).json({ error: "Error al registrarse" });
  }
});

export default usersRouter;
