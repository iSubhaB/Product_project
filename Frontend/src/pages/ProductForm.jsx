import { useState, useEffect } from "react";
import api from "../services/api";

export default function ProductForm({ editProduct }) {
    //editProduct == this is a props for optional edit product
    const [form, setForm] = useState({ name: "", description: "", price: "", category: "", subCategory: "" });
    const [images, setImages] = useState([]);
    const [preview, setPreview] = useState([]);

    const handleFiles = (e) => {
        const files = Array.from(e.target.files);  // if we upload file will store to files
        setImages(files);
        setPreview(files.map(file => URL.createObjectURL(file)));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.entries(form).forEach(([k, v]) => data.append(k, v)); //converts an object into an array of key-value pairs.
        images.forEach(file => data.append("images", file));
        await api.post("/products", data, { headers: { "Content-Type": "multipart/form-data" } });
        // clean up previews
        preview.forEach(url => URL.revokeObjectURL(url));//Removes temporary preview URLs to free memory
        alert("Created");
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3">
            <input onChange={e => setForm({ ...form, name: e.target.value })} />
            ...
            <input type="file" multiple accept="image/*" onChange={handleFiles} />
            <div className="flex gap-2">
                {preview.map((src, i) => <img key={i} src={src} className="h-20 w-20 object-cover rounded" />)}
            </div>
            <button type="submit">Save</button>
        </form>
    );
}
