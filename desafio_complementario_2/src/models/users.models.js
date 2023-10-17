import { Schema, model } from "mongoose";
import cartModel from "./carts.models.js";

const userSchema = new Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  role: {
    type: String,
    default: "user",
  },
  cart: {
    type: Schema.Types.ObjectId,
    ref: "carts",
  },
});

userSchema.pre("save", async function (next) {
  try {
    const newCart = await cartModel.create({});

    this.cart = newCart._id;
  } catch (error) {
    next(error);
  }
});

const userModel = model("users", userSchema);

export default userModel;
