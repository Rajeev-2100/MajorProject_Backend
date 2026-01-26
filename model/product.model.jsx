const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
  },
  productPrice: {
    type: Number,
    required: true,
  },
  discountPrice: {
    type: Number,
    required: true,
  },
  deliveryCharges: {
    type: Number,
    requried: true,
  },
  rating: {
    type: Number,
    required: true,
  },
  productQuantity: {
    type: Number,
    default: 1,
  },
  size: {
    type: String,
    enum: ["S", "M", "XL", "XXL"],
    required: true,
  },
  productDescription: {
    type: [String],
    required: true,
  },
});

const Product = mongoose.model("Product: ", productSchema);

module.exports = Product;