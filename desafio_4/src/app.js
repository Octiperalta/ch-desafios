import express from "express";
import { engine } from "express-handlebars";
import { __dirname } from "./path.js";
import path from "path";
import { Server } from "socket.io";
import ProductManager from "./controllers/productManager.js";

const PORT = 4000;
const app = express();
const PM = new ProductManager("src/models/products.json");

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

const io = new Server(server);

// * Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname, "./views"));

io.on("connection", (socket, error) => {
  console.log("Conectado con Socket.io");

  socket.on("nuevoProducto", async prod => {
    const {
      title,
      description,
      code,
      price,
      status = true,
      stock,
      category,
      thumbnails,
    } = prod;

    await PM.addProduct(
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails
    );

    const products = await PM.getProducts();

    io.emit("productos", products);
  });
});

// * Routes
app.use("/static", express.static(__dirname + "/public"));

app.get("/static", async (req, res) => {
  const products = await PM.getProducts();

  res.render("realTimeProducts", {
    name: "Octavio",
    jsFile: "realTimeProducts.js",
    products,
    hayProductos: products.length > 0,
  });
});

app.get("/static/home", async (req, res) => {
  const products = await PM.getProducts();

  res.render("home", { products });
});
