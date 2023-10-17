import { Router } from "express";
import cartModel from "../models/carts.models.js";

const cartRouter = Router();

cartRouter.get("/", async (req, res) => {
  const carts = await cartModel.find();

  res.status(200).json({ status: "OK", payload: carts });
});

cartRouter.post("/:cid/products/:pid", async (req, res) => {
  const { cid, pid } = req.params;
  const { quantity } = req.body;

  try {
    const cart = await cartModel.findById(cid);

    if (cart) {
      cart.products.push({ id_prod: pid, quantity: quantity });

      const response = await cartModel.findByIdAndUpdate(cid, cart);
      res.status(200).json({
        status: "OK",
        message: "Product succesfully added to cart. ",
        payload: response,
      });
    } else {
      res.status(400).send({ status: "Not OK", message: `Error: ${error}` });
    }
  } catch (error) {
    res.status(400).send({ status: "Not OK", message: `Error: ${error}` });
  }
});

export default cartRouter;
