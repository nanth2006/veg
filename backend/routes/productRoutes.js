import express from "express";
import {
    product,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
} from "../controller/productController.js";
import { protect, adminOnly } from "../middleware/auth.js";

const router = express.Router();

router.get("/products", getProducts);
router.get("/products/:id", getProductById);
router.post("/products", protect, adminOnly, product);
router.put("/products/:id", protect, adminOnly, updateProduct);
router.delete("/products/:id", protect, adminOnly, deleteProduct);

export default router;
