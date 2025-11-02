import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    images: [String],
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    subCategory: { type: mongoose.Schema.Types.ObjectId, ref: "SubCategory" },
     is_deleted:{type:Boolean,default:false}
});
productSchema.index({ name: "text", description: "text" });

export default mongoose.model("Product", productSchema);
