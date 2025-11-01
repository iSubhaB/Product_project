// src/components/CategoryFilter.jsx
import { useEffect, useState } from "react";
import api from "../services/api";

export default function CategoryFilter({ onSelect, selected }) {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await api.get("/categories");
                setCategories(res.data?.data || []);
            } catch (err) {
                console.error(" Error fetching categories:", err);
            }
        };
        fetchCategories();
    }, []);

    return (
        <select
            value={selected}
            onChange={(e) => onSelect(e.target.value || "")}
            className="border p-2 rounded w-full md:w-48"
        >
            <option value="">All Categories</option>
            {categories.map((c) => (
                <option key={c._id} value={c._id}>
                    {c.name}
                </option>
            ))}
        </select>

    );
}
