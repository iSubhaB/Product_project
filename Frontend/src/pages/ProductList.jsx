import { useState, useEffect } from "react";
import api from "../services/api";
import useDebounce from "../hooks/useDebounce";
import CategoryFilter from "../components/CategoryFilter";
import SubCategoryFilter from "../components/SubCategoryFilter";
import UpdateProduct from "../components/Edit File/UpdateProduct";
import Insert from "../components/Edit File/Insert";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(50);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [categoryId, setCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isInsert, setIsInsert] = useState(false);

  const debouncedSearch = useDebounce(search, 500);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(
        `/products?page=${page}&limit=${limit}&search=${debouncedSearch}` +
          (categoryId ? `&categoryId=${categoryId}` : "") +
          (subCategoryId ? `&subCategoryId=${subCategoryId}` : "")
      );
      setProducts(data.data || []);
      setTotalPages(data.totalPages || 1);
      setTotalCount(data.totalCount || 0);
    } catch (err) {
      console.error(err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [debouncedSearch, page, limit, categoryId, subCategoryId]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error(error);
      alert("Failed to delete product");
    }
  };

  const handleCloseInsert = () => setIsInsert(false);
  const handleCloseUpdate = () => {
    setSelectedProduct(null);
    fetchProducts(); // Refresh list after update
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-50 via-white to-gray-100 p-4 sm:p-6 lg:p-8">
      {/* BACKGROUND CONTENT */}
      <div
        className={`transition-all duration-300 ${
          isInsert || selectedProduct ? "blur-sm pointer-events-none select-none" : ""
        }`}
      >
        {/* HEADER */}
        <div className="mb-6 sm:mb-8 bg-white/60 backdrop-blur-md shadow-lg border border-gray-200 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-gray-800 tracking-tight mb-1 flex items-center gap-2">
              🛒 Product Inventory
            </h1>
            <p className="text-gray-500 text-base sm:text-lg">
              Manage and explore all products with smart filters and search.
            </p>
          </div>

          <button
            onClick={() => setIsInsert(true)}
            className="w-full sm:w-auto px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg transition-all duration-200 text-center"
          >
            ➕ Add Product
          </button>
        </div>

        {/* FILTER SECTION */}
        <div className="bg-white shadow-lg rounded-2xl p-4 sm:p-6 border border-gray-100 mb-6 sm:mb-8 hover:shadow-xl transition-shadow duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* SEARCH */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                placeholder="Type product name..."
                value={search}
                onChange={(e) => {
                  setPage(1);
                  setSearch(e.target.value);
                }}
                className="border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-400 outline-none transition-all duration-300 bg-white shadow-sm"
              />
            </div>

            {/* CATEGORY */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-1">
                Category
              </label>
              <CategoryFilter
                selected={categoryId}
                onSelect={(id) => {
                  setPage(1);
                  setCategoryId(id);
                  setSubCategoryId("");
                }}
              />
            </div>

            {/* SUBCATEGORY */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-1">
                Sub Category
              </label>
              <SubCategoryFilter
                categoryId={categoryId}
                selected={subCategoryId}
                onSelect={(id) => {
                  setPage(1);
                  setSubCategoryId(id);
                }}
              />
            </div>
          </div>

          <p className="text-sm text-gray-700 mt-4 font-medium">
            Showing <span className="font-semibold">{products.length}</span> items
            of <span className="font-semibold">{totalCount}</span>
          </p>
        </div>

        {/* PRODUCT TABLE (RESPONSIVE WRAP) */}
        <div className="bg-white rounded-2xl overflow-x-auto border border-gray-100 shadow-lg hover:shadow-2xl transition-shadow duration-300">
          <table className="w-full min-w-[800px] text-left border-collapse">
            <thead className="bg-indigo-600 text-white uppercase text-sm">
              <tr>
                <th className="p-3 border">#</th>
                <th className="p-3 border">Product Name</th>
                <th className="p-3 border">Description</th>
                <th className="p-3 border">Category</th>
                <th className="p-3 border">Sub Category</th>
                <th className="p-3 border">Price</th>
                <th className="p-3 border text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center p-4">
                    Loading...
                  </td>
                </tr>
              ) : products.length > 0 ? (
                products.map((row, index) => (
                  <tr
                    key={row._id}
                    className="hover:bg-indigo-50 transition-all duration-200"
                  >
                    <td className="p-3 border">{(page - 1) * limit + index + 1}</td>
                    <td className="p-3 border">{row.name}</td>
                    <td className="p-3 border">{row.description || "-"}</td>
                    <td className="p-3 border">{row.category?.name || "-"}</td>
                    <td className="p-3 border">{row.subCategory?.name || "-"}</td>
                    <td className="p-3 border">₹ {row.price}</td>
                    <td className="p-3 border text-center flex justify-center gap-2">
                      <button
                        onClick={() => handleDelete(row._id)}
                        className="bg-red-100 text-red-700 hover:bg-red-200 hover:text-red-800 text-sm py-1 px-2 rounded transition-all duration-200"
                      >
                        🗑️
                      </button>
                      <button
                        onClick={() => setSelectedProduct(row)}
                        className="bg-blue-100 text-blue-700 hover:bg-blue-200 hover:text-blue-800 text-sm py-1 px-2 rounded transition-all duration-200"
                      >
                        ✏️
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="text-center p-4 text-gray-500 italic"
                  >
                    No products found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mt-6 text-center">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className={`px-4 py-2 rounded-lg font-medium border transition-all duration-200 ${
              page === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg"
            }`}
          >
            Previous
          </button>

          <span className="text-gray-700 font-medium">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
            className={`px-4 py-2 rounded-lg font-medium border transition-all duration-200 ${
              page === totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg"
            }`}
          >
            Next
          </button>
        </div>
      </div>

      {/* INSERT MODAL */}
      {isInsert && <Insert onClose={handleCloseInsert} />}

      {/* EDIT MODAL */}
      {selectedProduct && (
        <UpdateProduct data={selectedProduct} onClose={handleCloseUpdate} />
      )}
    </div>
  );
};

export default ProductList;
