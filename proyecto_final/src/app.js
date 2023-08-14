import express from "express";
import productsRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.routes.js";

const PORT = 8080;
const app = express();

// * Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.use("*", (req, res) => {
  res.send({ status: "error", message: "Not found" });
});
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
