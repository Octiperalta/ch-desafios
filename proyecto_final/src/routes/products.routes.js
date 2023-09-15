import { Router } from "express";
import ProductManager from "../controllers/productManager.js";
import productModel from "../models/products.models.js";

const productsRouter = Router();

productsRouter.get("/", async (req, res) => {
  const {
    limit = 10,
    page = 1,
    sort = null,
    category = null,
    status = null,
  } = req.query;
  const paginateOptions = {
    page: page,
    limit: limit,
    sort: sort && { price: sort },
  };
  let query = {};

  if (status) query.status = status;
  if (category) query.category = category;

  try {
    const result = await productModel.paginate({ ...query }, paginateOptions);
    const {
      docs: products,
      totalPages,
      prevPage,
      nextPage,
      hasPrevPage,
      hasNextPage,
    } = result;

    const url = req.originalUrl.replace(/&?page=\d+/, "");
    const prevLink = hasPrevPage ? `${url}&page=${prevPage}` : null;
    const nextLink = hasNextPage ? `${url}&page=${nextPage}` : null;

    res.status(200).send({
      status: "OK",
      payload: products,
      totalPages,
      prevPage,
      nextPage,
      hasPrevPage,
      hasNextPage,
      prevLink,
      nextLink,
    });
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: "An error occured while searching for products",
      error: `${err}`,
    });
  }
});

productsRouter.get("/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    const product = await productModel.findById(pid);

    // Entiendo que no es necesario implementar un condicional IF ya que en caso de no encontrar el producto, va directo al CATCH
    // if (product) {
    res.status(200).json({
      status: "success",
      payload: product,
    });
    // } else {
    // console.log(product);
    // res.status(404).json({ status: "error", message: "Product not found" });
    // }
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: "An error occured while searching the product",
      error: `${err}`,
    });
  }
});
productsRouter.post("/", async (req, res) => {
  const {
    title,
    description,
    code,
    price,
    stock,
    category,
    thumbnails,
    status = true,
  } = req.body;

  if (title && description && code && price && stock && category) {
    try {
      const result = await productModel.create({
        title,
        description,
        stock,
        code,
        status,
        price,
        category,
      });

      res.status(200).json({
        status: "success",
        message: "Product succesfully created",
        payload: result,
      });
    } catch (err) {
      res.status(400).json({
        status: "error",
        message: "An error occured while tyring to create the product.",
        error: `${err}`,
      });
    }
  } else {
    res.status(400).json({
      status: "error",
      message: "All fields must be completed.",
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
  const { pid } = req.params;

  try {
    const result = await productModel.findByIdAndDelete(pid);

    res.status(200).json({
      status: "success",
      message: "Product succesfully deleted",
      payload: result,
    });
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: "An error occured while trying to delete the product",
      errorr: `${err}`,
    });
  }
});

export default productsRouter;
