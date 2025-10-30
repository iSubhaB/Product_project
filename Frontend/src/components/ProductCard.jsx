import ImageSlider from "./ImageSlider";
const API_BASE = import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "");

export default function ProductCard({ product }) {
    const imageUrls = (product.images || []).map(img => `${API_BASE}/uploads/${img}`);
    return (
        <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition">
            <ImageSlider images={imageUrls} />
            <h3 className="font-semibold text-lg mt-2">{product.name}</h3>
            <p className="text-sm text-gray-600 mb-1">{product.description}</p>
            <p className="text-sm text-gray-500">
                {product.category?.name} / {product.subCategory?.name}
            </p>
            <p className="text-green-600 font-bold mt-2">₹{product.price}</p>
        </div>
    );
}
