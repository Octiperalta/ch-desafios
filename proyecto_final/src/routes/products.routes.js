import { Router } from "express";
import ProductManager from "../controllers/productManager.js";

const productsRouter = Router();
const PM = new ProductManager("src/models/products.json");

productsRouter.get("/", async (req, res) => {
  const { limit } = req.query;
  const products = await PM.getProducts(limit);

  res.status(200).send({
    status: "OK",
    message: "Listado de productos obtenido exitosamente.",
    data: products,
  });
});

productsRouter.get("/:pid", async (req, res) => {
  const pid = parseInt(req.params.pid);
  const product = await PM.getProductById(pid);

  if (product) {
    res.status(200).send({
      status: "OK",
      message: `Producto con ID ${pid} obtenido exitosamente`,
      data: product,
    });
  } else {
    res.status(404).send({
      status: "ERROR",
      message: "No se encontro un producto con el ID indicado.",
    });
  }
});
productsRouter.post("/", async (req, res) => {
  const {
    title,
    description,
    code,
    price,
    status = true,
    stock,
    category,
    thumbnails,
  } = req.body;

  if (title && description && code && price && stock && category) {
    const result = await PM.addProduct(
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails
    );

    if (result.succesful) {
      res.status(200).send({ status: "OK", message: result.message });
    } else {
      res.status(400).send({ status: "ERROR", message: result.message });
    }
  } else {
    res.status(400).send({
      status: "ERROR",
      message: "Todos los campos son obligatorios.",
    });
  }
});

productsRouter.put("/:pid", async (req, res) => {
  const pid = parseInt(req.params.pid);
  const fieldsToUpdate = req.body;

  const result = await PM.updateProduct(pid, fieldsToUpdate);

  if (result.succesful) {
    res.status(200).send({ status: "OK", message: result.message });
  } else {
    res.status(400).send({ status: "ERROR", message: result.message });
  }
});

productsRouter.delete("/:pid", async (req, res) => {
  const pid = parseInt(req.params.pid);
  const result = await PM.deleteProduct(pid);

  if (result.succesful) {
    res.status(200).send({ status: "OK", message: result.message });
  } else {
    res.status(400).send({ status: "ERROR", message: result.message });
  }
});

export default productsRouter;
