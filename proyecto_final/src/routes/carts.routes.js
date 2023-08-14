import { Router } from "express";
import CartManager from "../controllers/cartManager.js";

const cartsRouter = Router();
const CM = new CartManager("src/models/carts.json");

cartsRouter.post("/", async (req, res) => {
  const { products = [] } = req.body;

  await CM.createCart(products);

  res
    .status(200)
    .send({ status: "OK", message: "Carrito creado de manera exitosa." });
});

cartsRouter.get("/:cid", async (req, res) => {
  const cid = parseInt(req.params.cid);
  const result = await CM.getCartById(cid);

  if (result.succesful) {
    const data = result.data;

    res.status(200).send({
      status: "OK",
      message: result.message,
      data: data.products,
    });
  } else {
    res.status(404).send({ status: "ERROR", message: result.message });
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

export default cartsRouter;
