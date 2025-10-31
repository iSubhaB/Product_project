import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
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


    // ✅ Define Table Columns
    const columns = [
        {
            name: "#",
            selector: (row, index) => (page - 1) * ITEMS_PER_PAGE + index + 1,
            width: "70px",
        },
        {
            name: "Image",
            cell: (row) =>
                row.images?.length > 0 ? (
                    <img
                        src={`${import.meta.env.VITE_API_URL}/uploads/${row.images[0]}`}
                        alt={row.name}
                        className="w-14 h-14 object-cover rounded"
                    />
                ) : (
                    <span className="text-gray-400 text-sm">No Image</span>
                ),
            width: "100px",
        },
        {
            name: "Product Name",
            selector: (row) => row.name,
            sortable: true,
        },
        {
            name: "Category",
            selector: (row) => row.category?.name || "-",
            sortable: true,
        },
        {
            name: "Sub Category",
            selector: (row) => row.subCategory?.name || "-",
            sortable: true,
        },
        {
            name: "Price",
            selector: (row) => `₹ ${row.price}`,
        },
    ];

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

            {/* ✅ React Data Table */}
            <DataTable
                columns={columns}
                data={products}
                highlightOnHover
                striped
                progressPending={loading}
                pagination
                paginationServer
                paginationTotalRows={totalCount}
                paginationPerPage={ITEMS_PER_PAGE}
                onChangePage={(newPage) => setPage(newPage)}
            />

            {/* Your existing bottom pagination if you still want it */}
            {/* <Pagination page={page} totalPages={totalPages} onPageChange={setPage} /> */}
        </div>
    );
};

export default ProductList;
