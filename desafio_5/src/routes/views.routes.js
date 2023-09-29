import { Router } from "express";
import productModel from "../models/products.models.js";

const handlebarsRouter = Router();

handlebarsRouter.get("/products", async (req, res) => {
  const products = await productModel.find().lean();
  const { username, userRole } = req.session;

  // * Es correcto implementar este tipo de seguridad en este endpoint?
  if (!req.session.logged) {
    return res.redirect("/static/login");
  }

  res.render("products", {
    products,
    user: { username, userRole },
  });
});

handlebarsRouter.get("/register", async (req, res) => {
  res.render("register", { cssFile: "register" });
});

handlebarsRouter.get("/login", async (req, res) => {
  if (req.session.logged) {
    return res.redirect("/static/products");
  }

  res.render("login", { cssFile: "login" });
});

export default handlebarsRouter;
