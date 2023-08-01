import { promises as fs } from "fs";

class Product {
  constructor(title, description, price, thumbnail, code, stock) {
    this.id = Product.incrementarID();
    this.title = title;
    this.description = description;
    this.price = price;
    this.thumbnail = thumbnail;
    this.code = code;
    this.stock = stock;
  }

  static incrementarID() {
    if (this.id) {
      this.id++;
    } else {
      this.id = 1;
    }

    return this.id;
  }
}

export default class ProductManager {
  constructor() {
    this.path = "./";
  }

  async addProduct(newProduct) {
    const products = JSON.parse(
      await fs.readFile(`${this.path}productos.txt`, "utf-8")
    );
    const reapetedProduct = products.find(prod => prod.code == newProduct.code);
    if (reapetedProduct) {
      console.log("El producto ya existe, no se pudo agregar");
      return;
    }

    products.push(newProduct);
    await fs.writeFile(`${this.path}productos.txt`, JSON.stringify(products));
  }

  async getProducts() {
    const products = JSON.parse(
      await fs.readFile(`${this.path}productos.txt`, "utf-8")
    );

    console.log(products);
  }

  async getProductById(id) {
    const products = JSON.parse(
      await fs.readFile(`${this.path}productos.txt`, "utf-8")
    );

    const productSearched = products.find(prod => prod.id === id);

    if (productSearched) {
      console.log(productSearched);
      return productSearched;
    } else {
      console.log("No existe un product con ese numero de ID");
    }
  }

  async updateProduct(id, fieldsToUpdate) {
    const products = JSON.parse(
      await fs.readFile(`${this.path}productos.txt`, "utf-8")
    );
    const indexProduct = products.findIndex(prod => prod.id === id);

    if (indexProduct != -1) {
      for (let key in fieldsToUpdate) {
        if (products[indexProduct].hasOwnProperty(key)) {
          products[indexProduct][key] = fieldsToUpdate[key];
        }
      }
      await fs.writeFile(`${this.path}productos.txt`, JSON.stringify(products));
    } else {
      console.log("No existe un producto con ese numero de ID");
    }
  }

  async deleteProduct(id) {
    const products = JSON.parse(
      await fs.readFile(`${this.path}productos.txt`, "utf-8")
    );

    const newProducts = products.filter(prod => prod.id !== id);
    console.log(newProducts);
    await fs.writeFile(
      `${this.path}productos.txt`,
      JSON.stringify(newProducts)
    );
  }
}

const product1 = new Product(
  "producto prueba",
  "Esto es un producto de prueba",
  200,
  "Sin imagen",
  "abc123",
  25
);
const product2 = new Product("Fideos", "Rico", 1000, "", "456", 20);

const PM = new ProductManager();

PM.addProduct(product2);
