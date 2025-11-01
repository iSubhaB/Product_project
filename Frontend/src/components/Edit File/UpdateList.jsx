import React, { useState, useEffect } from "react";
import axios from "../../services/api";

const UpdateList = ({ onClose }) => {
  const [products, setProducts] = useState([]);
  const [editId, setEditId] = useState(null);

  const fetchProducts = async () => {
    const { data } = await axios.get("/products");
    setProducts(data.data || []);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="mt-6 bg-white shadow-xl rounded-xl p-6 border border-gray-200">

      <div className="flex justify-between">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Update Product</h2>
        <button onClick={onClose} className="text-red-600 font-semibold">Close</button>
      </div>

      <table className="w-full border border-gray-300 rounded-lg overflow-hidden">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="p-3 border">Name</th>
            <th className="p-3 border">Category</th>
            <th className="p-3 border">Price</th>
            <th className="p-3 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id} className="hover:bg-gray-50">
              <td className="p-3 border">{p.name}</td>
              <td className="p-3 border">{p.category?.name || "-"}</td>
              <td className="p-3 border">₹{p.price}</td>
              <td className="p-3 border text-center">
                <button
                  onClick={() => setEditId(p._id)}
                  className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editId && (
        <UpdateProduct
          productId={editId}
          onClose={() => setEditId(null)}
          onUpdated={fetchProducts}
        />
      )}
    </div>
  );
};

export default UpdateList;
