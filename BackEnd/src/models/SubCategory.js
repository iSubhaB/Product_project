import mongoose from "mongoose";

const subCategorySchema = new mongoose.Schema({
    name: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
     is_deleted:{type:Boolean,default:false}
});

export default mongoose.model("SubCategory", subCategorySchema);
