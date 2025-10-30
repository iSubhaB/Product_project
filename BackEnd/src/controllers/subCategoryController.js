import SubCategory from "../models/SubCategory.js";

export const createSubCategory = async (req, res) => {
    try {
        const subCategory = await SubCategory.create(req.body);
        res.status(201).json({ success: true, data: subCategory });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

export const getSubCategories = async (req, res) => {
    try {
        const filter = req.query.categoryId ? { category: req.query.categoryId } : {};
        const subCategories = await SubCategory.find(filter).populate("category");
        res.status(200).json({ success: true, data: subCategories });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};

export const updateSubCategory = async (req, res) => {
    try {
        const subCategory = await SubCategory.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({ success: true, data: subCategory });
    } catch (err) {
        res.status(400).json({ success: false, message: err.message });
    }
};

export const deleteSubCategory = async (req, res) => {
    try {
        await SubCategory.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: "SubCategory deleted" });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
