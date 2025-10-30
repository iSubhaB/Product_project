import express from "express";
import {
    createSubCategory,
    getSubCategories,
    updateSubCategory,
    deleteSubCategory,
} from "../controllers/subCategoryController.js";

const router = express.Router();

router.route("/").post(createSubCategory).get(getSubCategories);
router.route("/:id").put(updateSubCategory).delete(deleteSubCategory);

export default router;
