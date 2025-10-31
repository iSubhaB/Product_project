import { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import api from "../services/api";
import useDebounce from "../hooks/useDebounce";
import CategoryFilter from "../components/CategoryFilter";
import SubCategoryFilter from "../components/SubCategoryFilter";

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

    const debouncedSearch = useDebounce(search, 500);

    useEffect(() => {
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

        fetchProducts();
    }, [debouncedSearch, page, limit, categoryId, subCategoryId]);

    const columns = [
        {
            name: "#",
            selector: (row, index) => (page - 1) * limit + index + 1,
            width: "70px",
        },
        {
            name: "Product Name",
            selector: (row) => row.name,
            sortable: true,
        },
        {
            name: "Description",
            selector: (row) => row.description || "-",
            wrap: true,
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

            {/*  Data Table */}
            <DataTable
                columns={columns}
                data={products}
                highlightOnHover
                striped
                progressPending={loading}
                pagination
                paginationServer
                paginationTotalRows={totalCount}
                paginationPerPage={limit}
                paginationRowsPerPageOptions={[10, 25, 50, 100]} 
                onChangePage={(newPage) => setPage(newPage)}
                onChangeRowsPerPage={(newLimit, newPage) => {
                    setLimit(newLimit); 
                    setPage(newPage);  
                }}
            />
        </div>
    );
};

export default ProductList;
