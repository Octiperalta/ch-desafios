import { Router } from "express";
import productModel from "../models/products.models.js";
import { passportError, authorization } from "../utils/messageErrors.js";

productModel;
const productRouter = new Router();

productRouter.get("/", async (req, res) => {
  const { limit } = req.query;

  try {
    const prods = await productModel.find().limit(limit);
    res.status(200).send({ status: "OK", data: prods });
  } catch (error) {
    res.status(400).send({
      status: "ERROR",
      error: `Error al consultar productos: ${error}`,
    });
  }
});

productRouter.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const prod = await productModel.findById(id);

    if (prod) {
      res.status(200).send({ status: "OK", data: prod });
    } else {
      res.status(404).send({ status: "Not found", data: prod });
    }
  } catch (error) {
    res.status(400).send({
      status: "ERROR",
      error: `Error al consultar producto: ${error}`,
    });
  }
});

productRouter.post(
  "/",
  passportError("jwt"),
  authorization("admin"),
  async (req, res) => {
    const { title, description, stock, code, price, category } = req.body;

    try {
      const response = await productModel.create({
        title,
        description,
        stock,
        price,
        category,
        code,
      });

      res.status(200).send({ status: "OK", data: response });
    } catch (error) {
      res.status(400).send({
        status: "ERROR",
        error: `Error al crear el producto: ${error}`,
      });
    }
  }
);

productRouter.put("/:id", authorization("admin"), async (req, res) => {
  const { id } = req.params;
  const { title, description, stock, code, price, category, status } = req.body;

  try {
    const response = await productModel.findByIdAndUpdate(id, {
      title,
      description,
      stock,
      code,
      price,
      category,
      status,
    });

    res.status(200).send({ status: "OK", data: response });
  } catch (error) {}
});

productRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const response = await productModel.findByIdAndDelete(id);
    if (prod) {
      res.status(200).send({ status: "OK", data: response });
    }

    res.status(200).send({ status: "OK", data: response });
  } catch (error) {}
});

export default productRouter;
