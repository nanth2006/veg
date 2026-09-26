import Product from "../models/product.js"; // .js extension mukkiyam

export const product = async (req, res) => {  // req first, res second!
    const { link, title, rate, category, description, stock } = req.body;
    try {
        const newProduct = await Product.create({ link, title, rate, category, description, stock });
        res.status(201).json(newProduct);
    } catch (err) {
        console.log("error", err);
        res.status(500).json({ message: "Something went wrong" });
    }
};

export const getProducts = async (req, res) => {
    try {
        const { category, search } = req.query;
        const filter = {};
        if (category && category !== "all") filter.category = category;
        if (search) filter.title = { $regex: search, $options: "i" };

        const products = await Product.find(filter).sort({ createdAt: -1 });
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

export const getProductById = async (req, res) => {
    try {
        const item = await Product.findById(req.params.id);
        if (!item) return res.status(404).json({ message: "Product not found" });
        res.status(200).json(item);
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) return res.status(404).json({ message: "Product not found" });
        res.status(200).json(updated);
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const deleted = await Product.findByIdAndDelete(req.params.id);
        if (!deleted) return res.status(404).json({ message: "Product not found" });
        res.status(200).json({ message: "Deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Something went wrong" });
    }
};
