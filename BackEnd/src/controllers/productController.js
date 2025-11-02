import Product from "../models/Product.js";
import Category from "../models/Category.js";
import SubCategory from "../models/SubCategory.js";
import mongoose from "mongoose";
import fs from "fs";

// ==================== CREATE PRODUCT ====================
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, categoryName, subCategoryName } = req.body;
    const imagePaths = req.files ? req.files.map((f) => f.filename) : [];

    // Check or create category
    let category = await Category.findOne({ name: categoryName });
    if (!category) {
      category = await Category.create({ name: categoryName });
    }

    // Check or create subcategory (under category)
    let subCategory = await SubCategory.findOne({
      name: subCategoryName,
      category: category._id,
    });

    if (!subCategory) {
      subCategory = await SubCategory.create({
        name: subCategoryName,
        category: category._id,
      });
    }

    // Create the Product
    const product = await Product.create({
      name,
      description,
      price,
      images: imagePaths,
      category: category._id,
      subCategory: subCategory._id,
    });

    res.status(201).json({
      success: true,
      data: product,
    });
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({
      success: false,
      message: "Server Error: Unable to create product",
      error: error.message,
    });
  }
};

// ==================== GET PRODUCTS ====================
export const getProducts = async (req, res) => {
  try {
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

    if (searchRegex) {
      andConditions.push({
        $or: [
          { name: { $regex: searchRegex } },
          { description: { $regex: searchRegex } },
        ],
      });
    }

    if (categoryId && mongoose.Types.ObjectId.isValid(categoryId)) {
      andConditions.push({ category: new mongoose.Types.ObjectId(categoryId) });
    }

    if (subCategoryId && mongoose.Types.ObjectId.isValid(subCategoryId)) {
      andConditions.push({
        subCategory: new mongoose.Types.ObjectId(subCategoryId),
      });
    }

    const matchStage =
      andConditions.length > 0 ? { $match: { $and: andConditions } } : {};

    const pipeline = [];
    if (Object.keys(matchStage).length > 0) pipeline.push(matchStage);

    pipeline.push(
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: { path: "$category", preserveNullAndEmptyArrays: true },
      },
      {
        $lookup: {
          from: "subcategories",
          localField: "subCategory",
          foreignField: "_id",
          as: "subCategory",
        },
      },
      {
        $unwind: { path: "$subCategory", preserveNullAndEmptyArrays: true },
      },
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

    const result = await Product.aggregate(pipeline);
    const metadata = result[0]?.metadata[0] || { total: 0 };
    let products = result[0]?.data || [];

    //  Add full image URLs dynamically
    const baseUrl = `${req.protocol}://${req.get("host")}/uploads/`;
    products = products.map((p) => ({
      ...p,
      images: p.images.map((img) => `${baseUrl}${img}`),
    }));

    res.status(200).json({
      success: true,
      totalCount: metadata.total,
      totalPages: Math.ceil(metadata.total / limit) || 1,
      currentPage: page,
      data: products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    res.status(500).json({
      success: false,
      message: "Server Error: Unable to fetch products",
      error: error.message,
    });
  }
};

// ==================== UPDATE PRODUCT ====================
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    // Replace images if new ones uploaded
    if (req.files && req.files.length > 0) {
      // Delete old images
      product.images.forEach((img) => {
        const filePath = `uploads/${img}`;
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
      });
      product.images = req.files.map((f) => f.filename);
    }

    Object.assign(product, req.body);
    await product.save();

    const baseUrl = `${req.protocol}://${req.get("host")}/uploads/`;
    product.images = product.images.map((img) => `${baseUrl}${img}`);

    res.status(200).json({ success: true, data: product });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({
      success: false,
      message: "Server Error: Unable to update product",
      error: error.message,
    });
  }
};

// ==================== DELETE PRODUCT ====================
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      return res.status(404).json({ message: "Product not found" });

    // Delete local images
    product.images.forEach((img) => {
      const filePath = `uploads/${img}`;
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });

    await product.deleteOne();

    res.status(200).json({ success: true, message: "Product deleted" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({
      success: false,
      message: "Server Error: Unable to delete product",
      error: error.message,
    });
  }
};
