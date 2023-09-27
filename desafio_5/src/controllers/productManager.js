import { promises as fs } from "fs";

export default class ProductManager {
  constructor(path) {
    this.path = path;
  }

  static getNextID() {
    if (!this.currentID) {
      this.currentID = 1;
    } else {
      this.currentID++;
    }
    return this.currentID;
  }

  async getProducts(limit) {
    const products = JSON.parse(await fs.readFile(this.path, "utf-8"));

    if (limit) return products.slice(0, limit);

    return products;
  }

  async getProductById(id) {
    const products = JSON.parse(await fs.readFile(this.path, "utf-8"));
    const product = products.find(prod => prod.id === id);

    if (!product) return false;

    return product;
  }

  async addProduct(
    title,
    description,
    code,
    price,
    status,
    stock,
    category,
    thumbnails = []
  ) {
    const products = JSON.parse(await fs.readFile(this.path, "utf-8"));

    const productExists = products.find(prod => prod.code === code);

    if (productExists)
      return { succesful: false, message: "Producto ya existente" };

    const newProduct = {
      id: ProductManager.getNextID(),
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    };

    products.push(newProduct);
    await fs.writeFile(this.path, JSON.stringify(products));

    return { succesful: true, message: "Producto agregado correctamente" };
  }

  async updateProduct(id, fieldsToUpdate) {
    const products = JSON.parse(await fs.readFile(this.path, "utf-8"));
    const indexProduct = products.findIndex(prod => prod.id === id);

    if (indexProduct != -1) {
      for (let key in fieldsToUpdate) {
        if (products[indexProduct].hasOwnProperty(key)) {
          products[indexProduct][key] = fieldsToUpdate[key];
        }
      }
      await fs.writeFile(this.path, JSON.stringify(products));
      return { succesful: true, message: "Producto actualizado correctamente" };
    } else {
      return {
        succesful: false,
        message: "No se encontró un producto con el ID indicado.",
      };
    }
  }

  async deleteProduct(id) {
    const products = JSON.parse(await fs.readFile(this.path, "utf-8"));
    const product = products.find(prod => prod.id === id);

    if (product) {
      const newProducts = products.filter(prod => prod.id !== id);
      await fs.writeFile(this.path, JSON.stringify(newProducts));

      return { succesful: true, message: "Producto borrado exitosamente" };
    } else {
      return {
        succesful: false,
        message: "No se encontró un producto con el ID indicado.",
      };
    }
  }
}
