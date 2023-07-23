import ProductManager from "./ProductManager.js";

// 1) Se crea una instancia de ProductManager
const PM = new ProductManager();

// 2) Se llama a getProduct y muestra un array vacio
PM.getProducts();

// 3) Se agrega un product de prueba
PM.addProduct(
  "producto prueba",
  "Este es un producto de prueba",
  200,
  "Sin imagen",
  "abc123",
  25
);

// 4) Llamo nuevamente al metodo getProduct y muestra el nuevo producto agregado
PM.getProducts();

// 5) Se intenta agregar un producto con codigo repetido para que devuelva error y no lo agregue
PM.addProduct(
  "producto prueba",
  "Este es un producto de prueba",
  200,
  "Sin imagen",
  "abc123",
  25
);

PM.getProducts();

// 6) Se intenta agregar un producto incompleto para que devuelva error y no lo agregue
PM.addProduct(
  "producto prueba",
  "Este es un producto de prueba",
  "Sin imagen",
  "abc123",
  25
);

PM.getProducts();

// 7) Se agregan mas productos correctamente
PM.addProduct(
  "otro producto de prueba",
  "Este es otro producto de prueba",
  800,
  "Sin imagen",
  "qwe456",
  2
);

PM.addProduct(
  "mas producto de prueba",
  "Este es otro producto de prueba",
  100,
  "Sin imagen",
  "zxc789",
  10
);

PM.getProducts();

// 8) Se evalua el funcionamiento de getProductById en caso de encontrar un producto o no
PM.getProductById(5); // ! Tira error
PM.getProductById(3); // * Lo encuentra
