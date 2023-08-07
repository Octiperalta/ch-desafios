import express from "express";
import ProductManager from "./productManager.js";

const app = express();
const PORT = 4000;
const PM = new ProductManager("products.json");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/products", async (req, res) => {
  const { limit } = req.query;
  const products = await PM.getProducts();

  if (limit) {
    res.send(products.slice(0, parseInt(limit)));
    return;
  }

  res.send(products);
});

app.get("/products/:pid", async (req, res) => {
  const pid = parseInt(req.params.pid);
  const product = await PM.getProductById(pid);

  if (!product) {
    res.send({ error: "No product with that ID" });
    return;
  }

  res.send(product);
});

app.get("*", (req, res) => {
  res.send({ error: "Not found", code: 404 });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
