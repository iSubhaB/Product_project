import express from "express";
import {
    createProduct,
    getProducts,
    updateProduct,
    deleteProduct,
} from "../controllers/productController.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();


router
    .route("/")
    .post(upload.array("images", 5), createProduct) // upload up to 5 images
    .get(getProducts);

router
    .route("/:id")
    .put(upload.array("images", 5), updateProduct)
    .delete(deleteProduct);

export default router;
