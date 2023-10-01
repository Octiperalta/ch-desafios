import { promises as fs } from "fs";

export default class CartManager {
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

  async createCart(products) {
    const carts = JSON.parse(await fs.readFile(this.path, "utf-8"));
    const newCart = { id: CartManager.getNextID(), products };

    carts.push(newCart);
    await fs.writeFile(this.path, JSON.stringify(carts));
    return true;
  }

  async getCartById(cid) {
    const carts = JSON.parse(await fs.readFile(this.path, "utf-8"));
    const cart = carts.find(c => c.id === cid);

    if (cart) {
      return {
        succesful: true,
        message: "Carrito encontrado correctamente",
        data: cart,
      };
    } else {
      return {
        succesful: false,
        message: "No se encontró un carrito con el ID indicado.",
      };
    }
  }

  async updateCartProducts(cid, products) {
    const carts = JSON.parse(await fs.readFile(this.path, "utf-8"));
    const cartIndex = carts.findIndex(c => c.id === cid);

    carts[cartIndex].products = products;

    await fs.writeFile(this.path, JSON.stringify(carts));
    return { succesful: true, message: "Carrito actualizado exitosamente." };
  }
}
