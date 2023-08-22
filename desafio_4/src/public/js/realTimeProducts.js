const socket = io();

const form = document.getElementById("productForm");
const table = document.getElementById("productTable");

form.addEventListener("submit", e => {
  e.preventDefault();

  const dataForm = new FormData(e.target); // obtengo el formulario

  const product = Object.fromEntries(dataForm);
  socket.emit("nuevoProducto", product);

  form.reset();
});

socket.on("productos", products => {
  table.innerHTML = "";

  products.forEach(prod => {
    const { title, code, category, price } = prod;
    const html = `<tr class="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
    <th
      scope="row"
      class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
    >
      ${title}
    </th>
    <td class="px-6 py-4">
      ${code}
    </td>
    <td class="px-6 py-4">
      ${category}
    </td>
    <td class="px-6 py-4">
      $${price}
    </td>
  </tr>`;

    table.innerHTML += html;
  });
});
