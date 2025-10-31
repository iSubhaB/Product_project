import { useState, useEffect } from "react";
import api from "../services/api";
import useDebounce from "../hooks/useDebounce";
import Pagination from "../components/Pagination";
import CategoryFilter from "../components/CategoryFilter";
import SubCategoryFilter from "../components/SubCategoryFilter";

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [categoryId, setCategoryId] = useState("");
    const [subCategoryId, setSubCategoryId] = useState("");
    const [loading, setLoading] = useState(false);

    const debouncedSearch = useDebounce(search, 500);
    const ITEMS_PER_PAGE = 50;

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const { data } = await api.get(
                    `/products?page=${page}&limit=${ITEMS_PER_PAGE}&search=${debouncedSearch}` +
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

        fetchProducts();
    }, [debouncedSearch, page, categoryId, subCategoryId]);

    return (
        <div className="p-5 space-y-4">
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4">
                <input
                    type="text"
                    placeholder="Search products..."
                    value={search}
                    onChange={(e) => {
                        setPage(1);
                        setSearch(e.target.value);
                    }}
                    className="border p-2 rounded flex-1"
                />

                <CategoryFilter
                    selected={categoryId}
                    onSelect={(id) => {
                        setPage(1);
                        setCategoryId(id);
                        setSubCategoryId("");
                    }}
                />

                <SubCategoryFilter
                    categoryId={categoryId}
                    selected={subCategoryId}
                    onSelect={(id) => {
                        setPage(1);
                        setSubCategoryId(id);
                    }}
                />
            </div>

            <p className="text-sm text-gray-600">
                Showing page {page} of {totalPages} — {totalCount} products
            </p>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full border-collapse border text-left">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border p-3">#</th>
                            <th className="border p-3">Image</th> 
                            <th className="border p-3">Product Name</th>
                            <th className="border p-3">Category</th>
                            <th className="border p-3">Sub Category</th>
                            <th className="border p-3">Price</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan="6" className="text-center p-5 text-gray-500">
                                    Loading...
                                </td>
                            </tr>
                        ) : products.length === 0 ? (
                            <tr>
                                <td colSpan="6" className="text-center p-5 text-gray-500">
                                    No Products Found
                                </td>
                            </tr>
                        ) : (
                            products.map((p, index) => (
                                <tr key={p._id} className="hover:bg-gray-50">
                                    <td className="border p-3">
                                        {(page - 1) * ITEMS_PER_PAGE + index + 1}
                                    </td>

                                    {/* ✅ Show image */}
                                    <td className="border p-3">
                                        {p.images?.length > 0 ? (
                                            <img
                                                src={`${import.meta.env.VITE_API_URL}/uploads/${p.images[0]}`}
                                                alt={p.name}
                                                className="w-14 h-14 object-cover rounded"
                                            />
                                        ) : (
                                            <span className="text-gray-400 text-sm">No Image</span>
                                        )}
                                    </td>

                                    <td className="border p-3">{p.name}</td>
                                    <td className="border p-3">{p.category?.name || "-"}</td>
                                    <td className="border p-3">{p.subCategory?.name || "-"}</td>
                                    <td className="border p-3">₹ {p.price}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
    );
};

export default ProductList;
