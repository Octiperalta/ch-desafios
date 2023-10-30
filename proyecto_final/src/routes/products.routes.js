import { Router } from "express";
import { authorization, passportError } from "../utils/messageErrors.js";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "../controllers/products.controller.js";

const productsRouter = Router();

productsRouter.get("/", getProducts);

productsRouter.get("/:pid", getProduct);

productsRouter.post(
  "/",
  passportError("jwt"),
  authorization("admin"),
  createProduct
);

productsRouter.put("/:pid", authorization("admin"), updateProduct);

productsRouter.delete("/:pid", authorization("admin"), deleteProduct);

export default productsRouter;
