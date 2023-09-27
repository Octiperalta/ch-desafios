import { Router } from "express";
import userModel from "../models/users.models.js";

const userRouter = Router();

userRouter.get("/", (req, res) => {
  res.render("register");
});

userRouter.post("/", async (req, res) => {
  const { first_name, last_name, email, password, age } = req.body;

  try {
    const response = await userModel.create({
      first_name,
      last_name,
      email,
      password,
      age,
    });

    console.log(response);

    req.session.username = response.first_name;
    req.session.userRole = response.role;
    req.session.logged = true;

    res.redirect("/products");
  } catch (err) {
    res.render("register", {
      error: "Mensaje de error que deberia ser mostrado por la vista",
    });
  }
});

export default userRouter;
