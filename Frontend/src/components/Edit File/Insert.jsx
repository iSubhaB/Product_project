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
      onClose(); // close popup after submit
    } catch (err) {
      console.log(err);
      alert("❌ Error creating product");
    }
  };

  return (
    // Popup wrapper
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="mt-6 bg-white shadow-xl rounded-xl p-6 border border-gray-200 w-11/12 max-w-4xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          X
        </button>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Insert Product</h2>
        </div>

        <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
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
            <tr className="hover:bg-gray-50">
              <td className="p-3 border">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Enter product name"
                />
              </td>

              <td className="p-3 border">
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Enter description"
                />
              </td>

              <td className="p-3 border">
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="Enter price"
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
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
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
                    <option key={sub._id} value={sub._id}>{sub.name}</option>
                  ))}
                </select>
              </td>
            </tr>
          </tbody>
        </table>

        <div className="mt-5 text-right">
          <button
            onClick={saveProduct}
            className="px-5 py-2 bg-green-600 text-white font-medium rounded-lg shadow hover:bg-green-700 transition"
          >
            Save Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default Insert;
