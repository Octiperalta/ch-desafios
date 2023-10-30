import productModel from "../models/products.models.js";

export const getProducts = async (req, res) => {
  const {
    limit = 10,
    page = 1,
    sort = null,
    category = null,
    status = null,
  } = req.query;
  const paginateOptions = {
    page: page,
    limit: limit,
    sort: sort && { price: sort },
  };
  let query = {};

  if (status) query.status = status;
  if (category) query.category = category;

  try {
    const result = await productModel.paginate({ ...query }, paginateOptions);
    const {
      docs: products,
      totalPages,
      prevPage,
      nextPage,
      hasPrevPage,
      hasNextPage,
    } = result;

    const url = req.originalUrl.replace(/&?page=\d+/, "");
    const prevLink = hasPrevPage ? `${url}&page=${prevPage}` : null;
    const nextLink = hasNextPage ? `${url}&page=${nextPage}` : null;

    res.status(200).send({
      status: "OK",
      payload: products,
      totalPages,
      prevPage,
      nextPage,
      hasPrevPage,
      hasNextPage,
      prevLink,
      nextLink,
    });
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: "An error occured while searching for products",
      error: `${err}`,
    });
  }
};

export const getProduct = async (req, res) => {
  const { pid } = req.params;
  try {
    const product = await productModel.findById(pid);

    res.status(200).json({
      status: "success",
      payload: product,
    });
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: "An error occured while searching the product",
      error: `${err}`,
    });
  }
};

export const createProduct = async (req, res) => {
  const {
    title,
    description,
    code,
    price,
    stock,
    category,
    thumbnails,
    status = true,
  } = req.body;

  if (title && description && code && price && stock && category) {
    try {
      const result = await productModel.create({
        title,
        description,
        stock,
        code,
        status,
        price,
        category,
      });

      res.status(200).json({
        status: "success",
        message: "Product succesfully created",
        payload: result,
      });
    } catch (err) {
      if (err.code === 11000) {
        return res.status(400).json({
          status: "error",
          message: "An error occured while tyring to create the product.",
          error: "Product is already created (code is reapeted)",
        });
      }

      res.status(400).json({
        status: "error",
        message: "An error occured while tyring to create the product.",
        error: `${err}`,
      });
    }
  } else {
    res.status(400).json({
      status: "error",
      message: "All fields must be completed.",
    });
  }
};

export const updateProduct = async (req, res) => {
  const { pid } = req.params;
  const fieldsToUpdate = req.body;

  try {
    const prod = await productModel.findByIdAndUpdate(pid, fieldsToUpdate, {
      new: true,
    });

    if (prod) {
      return res.status(200).json({
        status: "success",
        message: "Product succesfully updated",
        payload: prod,
      });
    }

    return res.status(404).send({ error: "Producto no encontrado" });
  } catch (err) {
    return res.status(400).json({
      status: "error",
      message: "An error occured while tyring to update the product.",
      error: `${err}`,
    });
  }
};

export const deleteProduct = async (req, res) => {
  const { pid } = req.params;

  try {
    const result = await productModel.findByIdAndDelete(pid);

    res.status(200).json({
      status: "success",
      message: "Product succesfully deleted",
      payload: result,
    });
  } catch (err) {
    res.status(400).json({
      status: "error",
      message: "An error occured while trying to delete the product",
      errorr: `${err}`,
    });
  }
};
