import { Router } from "express";
import CartManager from "../controllers/cartManager.js";
import cartModel from "../models/carts.models.js";
import { Schema } from "mongoose";

const cartsRouter = Router();
const CM = new CartManager("src/models/carts.json");

cartsRouter.post("/", async (req, res) => {
  const { products = [] } = req.body;

  try {
    const result = await cartModel.create({ products });

    res.status(200).json({
      status: "OK",
      message: "Carrito creado de manera exitosa.",
      payload: result,
    });
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: "An error occured while trying to create the cart",
      error: `${err}`,
    });
  }
});

cartsRouter.get("/:cid", async (req, res) => {
  const { cid } = req.params;

  try {
    const cart = await cartModel.findById(cid).populate("products.id_prod");

    res.status(200).json({ status: "success", payload: cart });
  } catch (err) {
    res.status(404).json({
      status: "error",
      message: "An error occured while searching for the cart",
      error: `${err}`,
    });
  }
});

cartsRouter.post("/:cid/product/:pid", async (req, res) => {
  const pid = parseInt(req.params.pid);
  const cid = parseInt(req.params.cid);
  const result = await CM.getCartById(cid);

  if (result.succesful) {
    const { products } = result.data;
    const productIndex = products.findIndex(prod => prod.id == pid);

    if (productIndex > -1) {
      products[productIndex].quantity++;
    } else {
      products.push({ id: pid, quantity: 1 });
    }

    await CM.updateCartProducts(cid, products);
    res
      .status(200)
      .send({ status: "OK", message: "Carrito actualizado exitosamente." });
  } else {
    res.status(404).send({ status: "ERROR", message: result.message });
  }
});

cartsRouter.delete("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;

  try {
    const result = await cartModel.findByIdAndUpdate(
      { _id: cid },
      { $pull: { products: { id_prod: pid } } },
      { upsert: false, new: true }
    );

    // ! No encuentro la forma de controlar este tipo de errores, ya que siempre que no encuentra por ID va por el lado del catch
    /* 
      if (!result)
      res
    .status(404)
    .json({ status: "error", message: "Cart or product not found" });
    */

    res.status(200).json({ status: "success", payload: result });
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: "An error  occured while trying to delete the product",
      error: `${err}`,
    });
  }
});

cartsRouter.put("/:cid", async (req, res) => {
  const { cid } = req.params;
  const { products: newProducts } = req.body;

  if (!newProducts)
    return res.status(400).send({
      status: "error",
      message: "A list of products must be provided",
    });

  try {
    const result = await cartModel.findByIdAndUpdate(
      { _id: cid },
      { products: newProducts },
      { new: true }
    );

    res.status(200).json({
      status: "success",
      message: "Cart successfully updated",
      payload: result,
    });
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: "An error occured while trying to update the cart",
      error: `${err}`,
    });
  }
});

cartsRouter.put("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  try {
    const result = await cartModel.findByIdAndUpdate(
      cid,
      { $inc: { "products.$[prod].quantity": quantity } },
      { arrayFilters: [{ "prod.id_prod": pid }], new: true }
    );

    res.status(200).json({ status: "success", payload: result });
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: "An error occured while trying to update the cart",
      error: `${err}`,
    });
  }
});

cartsRouter.delete("/:cid", async (req, res) => {});

export default cartsRouter;
