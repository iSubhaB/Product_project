// Insert.js
import React, { useState } from "react";
import axios from "../../services/api";

const Insert = ({ onClose }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryName, setCategoryName] = useState("");
  const [subCategoryName, setSubCategoryName] = useState("");
  const [images, setImages] = useState([]);

  // Popup message state
  const [popup, setPopup] = useState({ show: false, message: "", type: "" });

  const handleFileChange = (e) => {
    setImages([...e.target.files]);
  };

  // Function to show popup
  const showPopup = (message, type = "success") => {
    setPopup({ show: true, message, type });
    setTimeout(() => setPopup({ show: false, message: "", type: "" }), 3000);
  };

  const saveProduct = async () => {
    try {
      if (!name || !price || !categoryName || !subCategoryName) {
        showPopup("⚠️ Please fill all required fields.", "error");
        return;
      }

      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("categoryName", categoryName);
      formData.append("subCategoryName", subCategoryName);

      images.forEach((file) => {
        formData.append("images", file);
      });

      await axios.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      showPopup("✅ Product created successfully!", "success");

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err) {
      console.error(err);
      showPopup("❌ Error creating product. Please check console.", "error");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="relative w-11/12 max-w-3xl bg-white rounded-xl shadow-2xl p-6 sm:p-8 animate-fadeIn">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition text-lg font-bold"
        >
          &times;
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Insert New Product
        </h2>

        {/* Form Fields */}
        <div className="space-y-4">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Product name"
          />

          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Description"
          />

          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Price"
          />

          <input
            type="text"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Category name"
          />

          <input
            type="text"
            value={subCategoryName}
            onChange={(e) => setSubCategoryName(e.target.value)}
            className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Subcategory name"
          />

          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        {/* Submit button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={saveProduct}
            className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition"
          >
            Save Product
          </button>
        </div>

        {/* ✅ Popup message */}
        {popup.show && (
          <div
            className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 px-4 py-3 rounded-lg shadow-lg text-white font-medium transition-all duration-500 ${
              popup.type === "success"
                ? "bg-green-600"
                : popup.type === "error"
                ? "bg-red-600"
                : "bg-gray-600"
            }`}
          >
            {popup.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default Insert;
