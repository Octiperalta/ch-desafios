import { Router } from "express";
import productModel from "../models/products.models.js";

const viewsRouter = Router();

viewsRouter.get("/products", async (req, res) => {
  // * Es correcto implementar este tipo de seguridad en este endpoint?
  if (!req.session.logged) {
    return res.redirect("/static/login");
  }

  const products = await productModel.find().lean();
  const { first_name: username, role: userRole } = req.session.user;

  res.render("products", {
    products,
    user: { username, userRole },
  });
});

viewsRouter.get("/register", async (req, res) => {
  res.render("register", { cssFile: "register" });
});

viewsRouter.get("/login", async (req, res) => {
  if (req.session.logged) {
    return res.redirect("/static/products");
  }

  res.render("login", { cssFile: "login" });
});

export default viewsRouter;
