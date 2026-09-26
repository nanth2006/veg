import mongoose from "mongoose"; // "Mongoose" extra import venaam

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    link: { type: String, required: true }, // image url
    rate: { type: Number, required: true },
    category: { type: String, default: "general" },
    description: { type: String, default: "" },
    stock: { type: Number, default: 100 },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
