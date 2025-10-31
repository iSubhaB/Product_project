// src/components/SubCategoryFilter.jsx
import { useEffect, useState } from "react";
import api from "../services/api";

export default function SubCategoryFilter({ categoryId, onSelect, selected }) {
    const [subCategories, setSubCategories] = useState([]);

    useEffect(() => {
        const fetchSubCategories = async () => {
            if (!categoryId) {
                setSubCategories([]);
                return;
            }
            try {
                const res = await api.get(`/subcategories?categoryId=${categoryId}`);
                setSubCategories(res.data?.data || []);
            } catch (err) {
                console.error(" Error fetching subcategories:", err);
                setSubCategories([]);
            }
        };
        fetchSubCategories();
    }, [categoryId]);

    return (
        <select
            value={selected}
            onChange={(e) => onSelect(e.target.value || "")}
            disabled={!categoryId}
            className="border p-2 rounded w-full md:w-48"
        >
            <option value="">All Subcategories</option>
            {subCategories.map((s) => (
                <option key={s._id} value={s._id}>
                    {s.name}
                </option>
            ))}
        </select>

    );
}
