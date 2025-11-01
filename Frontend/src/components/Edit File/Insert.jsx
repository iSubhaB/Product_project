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

  const handleFileChange = (e) => {
    setImages([...e.target.files]);
  };

  const saveProduct = async () => {
    try {
      if (!name || !price || !categoryName || !subCategoryName) {
        alert("⚠️ Please fill all required fields.");
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

      alert(" Product Created Successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      alert(" Error creating product. Please check console.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      <div className="relative w-11/12 max-w-3xl bg-white rounded-xl shadow-2xl p-6 sm:p-8 animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition text-lg font-bold"
        >
          &times;
        </button>

        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Insert New Product
        </h2>

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

        <div className="mt-6 flex justify-end">
          <button
            onClick={saveProduct}
            className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg shadow hover:bg-green-700 transition"
          >
            Save Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default Insert;
