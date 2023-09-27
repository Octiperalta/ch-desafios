import { Router } from "express";
import userModel from "../models/users.models.js";

const sessionsRouter = Router();

sessionsRouter.get("/", (req, res) => {
  if (req.session.logged) {
    console.log(req.session);
    return res.redirect("/products");
  }

  res.redirect("/login");
});
sessionsRouter.get("/login", (req, res) => {
  if (req.session.logged) {
    console.log(req.session);
    return res.redirect("/products");
  }

  res.render("login");
});

sessionsRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (req.session.logged) {
    return res.redirect("/products");
  }

  try {
    const user = await userModel.findOne({ email: email });

    if (user) {
      if (user.password === password) {
        req.session.username = user.first_name;
        req.session.userRole = user.role;
        req.session.logged = true;

        res.redirect("/products");
      } else {
        res.status(401).send({ resultado: "Unauthorized", message: user });
      }
    } else {
      res.status(404).send({ resultado: "Not Found", message: user });
    }
  } catch (error) {
    // res
    //   .status(400)
    //   .send({ error: `There was an error while trying to login in: ${error}` });
    res.render("login", { error: error });
  }
});

sessionsRouter.post("/logout", (req, res) => {
  console.log("LOGOUT");
  console.log(req.session);

  if (req.session.logged) {
    req.session.destroy();
  }

  res.redirect("login");
});

export default sessionsRouter;
