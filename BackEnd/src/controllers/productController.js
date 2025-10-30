import Product from "../models/Product.js";
import mongoose from "mongoose";
import catchAsync from "../utils/catchAsync.js";
import fs from "fs";

// Create new product
export const createProduct = catchAsync(async (req, res) => {
    const imagePaths = req.files ? req.files.map((f) => f.filename) : [];

    const product = await Product.create({
        ...req.body,
        images: imagePaths,
    });

    res.status(201).json({ success: true, data: product });
});

export const getProducts = catchAsync(async (req, res) => {
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.max(1, Number(req.query.limit) || 50);
    const skip = (page - 1) * limit;
    const search = req.query.search ? String(req.query.search).trim() : "";
    const categoryId = req.query.categoryId || null;
    const subCategoryId = req.query.subCategoryId || null;

    const searchRegex = search
        ? new RegExp(search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i")
        : null;

    const andConditions = [];

    // 🔹 Search by name or description
    if (searchRegex) {
        andConditions.push({
            $or: [{ name: { $regex: searchRegex } }, { description: { $regex: searchRegex } }],
        });
    }

    // 🔹 Category filter (if provided)
    if (categoryId && mongoose.Types.ObjectId.isValid(categoryId)) {
        andConditions.push({ category: new mongoose.Types.ObjectId(categoryId) });
    }

    // 🔹 Subcategory filter (if provided)
    if (subCategoryId && mongoose.Types.ObjectId.isValid(subCategoryId)) {
        andConditions.push({ subCategory: new mongoose.Types.ObjectId(subCategoryId) });
    }

    // ✅ Match first for efficiency
    const matchStage = andConditions.length > 0 ? { $match: { $and: andConditions } } : {};

    const pipeline = [];

    if (Object.keys(matchStage).length > 0) pipeline.push(matchStage);

    // ✅ Lookup category and subcategory
    pipeline.push(
        {
            $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "category",
            },
        },
        { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
        {
            $lookup: {
                from: "subcategories",
                localField: "subCategory",
                foreignField: "_id",
                as: "subCategory",
            },
        },
        { $unwind: { path: "$subCategory", preserveNullAndEmptyArrays: true } },
        {
            $facet: {
                metadata: [{ $count: "total" }],
                data: [
                    { $sort: { _id: -1 } },
                    { $skip: skip },
                    { $limit: limit },
                    {
                        $project: {
                            name: 1,
                            description: 1,
                            price: 1,
                            rating: 1,
                            stock: 1,
                            images: 1,
                            "category._id": 1,
                            "category.name": 1,
                            "subCategory._id": 1,
                            "subCategory.name": 1,
                        },
                    },
                ],
            },
        }
    );

    const result = await Product.aggregate(pipeline).allowDiskUse(true);
    const metadata = result[0]?.metadata[0] || { total: 0 };
    const products = result[0]?.data || [];

    res.status(200).json({
        success: true,
        totalCount: metadata.total,
        totalPages: Math.ceil(metadata.total / limit) || 1,
        currentPage: page,
        data: products,
    });
});


// Update product + replace images if uploaded
export const updateProduct = catchAsync(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    if (req.files && req.files.length > 0) {
        // Delete old images from uploads folder
        product.images.forEach((img) => {
            const filePath = `uploads/${img}`;
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        });
        product.images = req.files.map((f) => f.filename);
    }

    Object.assign(product, req.body);
    await product.save();

    res.status(200).json({ success: true, data: product });
});

// Delete product and local images
export const deleteProduct = catchAsync(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    product.images.forEach((img) => {
        const filePath = `uploads/${img}`;
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });

    await product.deleteOne();

    res.status(200).json({ success: true, message: "Product deleted" });
});
