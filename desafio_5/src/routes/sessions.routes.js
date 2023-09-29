import { Router } from "express";
import userModel from "../models/users.models.js";

const sessionsRouter = Router();

sessionsRouter.get("/login", (req, res) => {
  if (req.session.logged) {
    return res.redirect("/static/products");
  }

  res.render("login");
});

sessionsRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (req.session.logged) {
    return res.redirect("/static/products");
  }

  try {
    const user = await userModel.findOne({ email: email });

    if (user) {
      if (user.password === password) {
        req.session.username = user.first_name;
        req.session.userRole = user.role;
        req.session.logged = true;

        res.redirect("/static/products");
      } else {
        res.status(401).send({ resultado: "Unauthorized", message: user });
      }
    } else {
      res.status(404).send({ resultado: "Not Found", message: user });
    }
  } catch (error) {
    res.render("login", { error: error });
  }
});

sessionsRouter.post("/logout", (req, res) => {
  if (req.session.logged) {
    req.session.destroy();
  }

  res.redirect("/static/login");
});

export default sessionsRouter;
