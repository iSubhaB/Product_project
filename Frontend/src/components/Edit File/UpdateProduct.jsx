import { useState } from "react";
import api from "../../services/api";

const UpdateProduct = ({ data, onClose }) => {
  const [formData, setFormData] = useState({
    name: data.name || "",
    description: data.description || "",
    price: data.price || "",
    categoryId: data.category?._id || "",
    subCategoryId: data.subCategory?._id || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      await api.put(`/products/${data._id}`, formData);
      alert("✅ Product updated successfully!");
      if (onClose) onClose();
    } catch (err) {
      console.error(err);
      setError("❌ Failed to update product.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 border border-gray-100 transform transition-all scale-100 hover:scale-[1.01] relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          ✏️ Update Product
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && <p className="text-red-600 text-sm">{error}</p>}

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 outline-none transition-all duration-300 bg-white shadow-sm"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 outline-none transition-all duration-300 bg-white shadow-sm"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 outline-none transition-all duration-300 bg-white shadow-sm"
            />
          </div>

          {formData.categoryId && (
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Category ID
              </label>
              <input
                type="text"
                value={formData.categoryId}
                readOnly
                className="w-full border border-gray-200 rounded-lg p-2 bg-gray-50 text-gray-600"
              />
            </div>
          )}

          {formData.subCategoryId && (
            <div>
              <label className="block text-gray-700 font-medium mb-1">
                Sub Category ID
              </label>
              <input
                type="text"
                value={formData.subCategoryId}
                readOnly
                className="w-full border border-gray-200 rounded-lg p-2 bg-gray-50 text-gray-600"
              />
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border text-gray-700 bg-gray-100 hover:bg-gray-200 transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className={`px-4 py-2 rounded-lg text-white transition-all duration-200 ${
                saving
                  ? "bg-indigo-400 cursor-not-allowed"
                  : "bg-indigo-600 hover:bg-indigo-700 shadow-md hover:shadow-lg"
              }`}
            >
              {saving ? "Saving..." : "Update Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateProduct;
