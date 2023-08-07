import { promises as fs } from "fs";

export default class ProductManager {
  constructor(path) {
    this.path = `./src/${path}`;
  }

  async getProducts() {
    const products = JSON.parse(await fs.readFile(this.path, "utf-8"));

    return products;
  }

  async getProductById(id) {
    const products = JSON.parse(await fs.readFile(this.path, "utf-8"));

    const productSearched = products.find(prod => prod.id === id);

    if (productSearched) {
      return productSearched;
    } else {
      return null;
    }
  }
}
