class Product {
  constructor(id, title, description, price, thumbnail, code, stock) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.price = price;
    this.thumbnail = thumbnail;
    this.code = code;
    this.stock = stock;
  }
}

export default class ProductManager {
  constructor() {
    this.products = [];
  }

  addProduct(title, description, price, thumbnail, code, stock) {
    const repeatedCode = this.products.find(prod => prod.code == code);
    const allFieldsCompleted =
      title && description && price && thumbnail && code && stock;

    if (repeatedCode) {
      console.log("Error: Already exists a product with that code.");
    } else if (!allFieldsCompleted) {
      console.log("Error: All fields are required.");
    } else {
      const newID = this.products.length + 1;
      const newProduct = new Product(
        newID,
        title,
        description,
        price,
        thumbnail,
        code,
        stock
      );

      this.products = this.products.concat(newProduct);
      console.log(`Product succesfully added with ID number: ${newID}.`);
    }
  }

  getProducts() {
    console.log(this.products);
  }

  getProductById(id) {
    const index = this.products.findIndex(prod => prod.id == id);

    if (index < 0) {
      console.log("Error: Not found");
      return;
    }

    console.log("El producto buscado: ", this.products[index]);
  }
}
