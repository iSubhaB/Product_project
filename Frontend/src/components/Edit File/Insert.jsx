// Insert.js
import React, { useState, useEffect } from "react";
import axios from "../../services/api";

const Insert = ({ onClose }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data } = await axios.get("/categories");
      setCategories(data.data);
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (!categoryId) {
      setSubCategories([]);
      setSubCategoryId("");
      return;
    }
    const fetchSubCategories = async () => {
      const { data } = await axios.get(`/subcategories?categoryId=${categoryId}`);
      setSubCategories(data.data);
    };
    fetchSubCategories();
  }, [categoryId]);

  const saveProduct = async () => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("category", categoryId);
      formData.append("subCategory", subCategoryId);

      await axios.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("✅ Product Created Successfully!");
      onClose();
    } catch (err) {
      console.log(err);
      alert("❌ Error creating product");
    }
  };

  return (
    // Modal overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm">
      {/* Modal container */}
      <div className="relative w-11/12 max-w-3xl bg-white rounded-xl shadow-2xl p-6 sm:p-8 animate-fadeIn">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-500 transition text-lg font-bold"
        >
          &times;
        </button>

        {/* Modal Header */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Insert New Product
        </h2>

        {/* Form Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-200">
            <thead className="bg-gray-100 text-gray-700">
              <tr>
                <th className="p-3 border">Name</th>
                <th className="p-3 border">Description</th>
                <th className="p-3 border">Price</th>
                <th className="p-3 border">Category</th>
                <th className="p-3 border">Sub Category</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-gray-50 transition">
                <td className="p-3 border">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="Product name"
                  />
                </td>
                <td className="p-3 border">
                  <input
                    type="text"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="Description"
                  />
                </td>
                <td className="p-3 border">
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                    placeholder="Price"
                  />
                </td>
                <td className="p-3 border">
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="p-3 border">
                  <select
                    value={subCategoryId}
                    onChange={(e) => setSubCategoryId(e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="">Select Sub Category</option>
                    {subCategories.map((sub) => (
                      <option key={sub._id} value={sub._id}>
                        {sub.name}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Save Button */}
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
