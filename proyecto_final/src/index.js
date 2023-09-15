import "dotenv/config.js";

import express from "express";
import productsRouter from "./routes/products.routes.js";
import cartsRouter from "./routes/carts.routes.js";
import mongoose from "mongoose";

const PORT = 8080;
const app = express();

// * Database connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("Connected with database.");
  })
  .catch(err => conseole.log(`Error connecting with the database: ${err}`));

// * Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// * Routes
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.use("*", (req, res) => {
  res.send({ status: "error", message: "Not found" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
