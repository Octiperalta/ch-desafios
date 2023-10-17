import { Schema, model } from "mongoose";

const cartSchema = new Schema({
  products: {
    type: [
      {
        id_prod: {
          type: Schema.Types.ObjectId, // * Es el ID autogenerado por MongoDB
          ref: "products",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    default: function () {
      return [];
    },
  },
});

cartSchema.pre("findOne", function () {
  this.populate("products.id_prod");
});

const cartModel = model("carts", cartSchema);

export default cartModel;
