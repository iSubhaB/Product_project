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
    fetchProducts(); // Refresh after update
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-indigo-50 via-white to-gray-100 p-4 sm:p-6 lg:p-8">
      {/* BLUR WHEN MODAL OPEN */}
      <div
        className={`transition-all duration-300 ${
          isInsert || selectedProduct ? "blur-sm pointer-events-none select-none" : ""
        }`}
      >
        {/* HEADER */}
        <div className="mb-6 sm:mb-8 bg-white/60 backdrop-blur-md shadow-lg border border-gray-200 rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-gray-800 flex items-center gap-2">
              🛍️ Product Inventory
            </h1>
            <p className="text-gray-500 text-base">
              Manage and explore all products with filters and search.
            </p>
          </div>

          <button
            onClick={() => setIsInsert(true)}
            className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 shadow-md transition-all"
          >
            ➕ Add Product
          </button>
        </div>

        {/* FILTERS */}
        <div className="bg-white shadow-lg rounded-2xl p-4 sm:p-6 border border-gray-100 mb-6 sm:mb-8 hover:shadow-xl transition-shadow duration-300">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* SEARCH */}
            <div className="flex flex-col">
              <label className="text-sm font-semibold text-gray-700 mb-1">Search</label>
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
              <label className="text-sm font-semibold text-gray-700 mb-1">Category</label>
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
              <label className="text-sm font-semibold text-gray-700 mb-1">Sub Category</label>
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
            Showing <span className="font-semibold">{products.length}</span> items of{" "}
            <span className="font-semibold">{totalCount}</span>
          </p>
        </div>

        {/* PRODUCT CARD GRID */}
        {loading ? (
          <div className="text-center text-gray-500 py-8">Loading...</div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <div
                key={product._id}
                className="bg-white border border-gray-200 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
              >
                {/* IMAGE */}
                <div className="relative h-48 w-full bg-gray-100 flex items-center justify-center overflow-hidden">
                  <img
                    src={product.image || "/placeholder.png"}
                    alt={product.name}
                    className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                  />
                </div>

                {/* DETAILS */}
                <div className="p-4 flex flex-col flex-grow">
                  <h2 className="text-lg font-bold text-gray-800 mb-1">
                    {product.name}
                  </h2>
                  <p className="text-gray-500 text-sm mb-2 line-clamp-2">
                    {product.description || "No description"}
                  </p>

                  <div className="text-sm text-gray-600 mb-1">
                    <span className="font-semibold">Category:</span>{" "}
                    {product.category?.name || "-"}
                  </div>
                  <div className="text-sm text-gray-600 mb-3">
                    <span className="font-semibold">Subcategory:</span>{" "}
                    {product.subCategory?.name || "-"}
                  </div>

                  <div className="mt-auto flex justify-between items-center">
                    <span className="text-lg font-bold text-indigo-600">
                      ₹ {product.price}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedProduct(product)}
                        className="bg-blue-100 text-blue-700 hover:bg-blue-200 text-sm py-1 px-2 rounded transition-all"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        className="bg-red-100 text-red-700 hover:bg-red-200 text-sm py-1 px-2 rounded transition-all"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 italic py-8">
            No products found
          </div>
        )}

        {/* PAGINATION */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-8">
          <button
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              page === 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md"
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
            className={`px-4 py-2 rounded-lg font-medium transition-all ${
              page === totalPages
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-md"
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
