import { useState } from "react";

export default function ImageSlider({ images }) {
    const [index, setIndex] = useState(0);

    if (!images || images.length === 0)
        return <div className="bg-gray-100 h-32 flex items-center justify-center">No Image</div>;

    const next = () => setIndex((i) => (i + 1) % images.length);
    const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);

    return (
        <div className="relative">
            <img
                src={images[index]}
                alt="Product"
                className="w-full h-40 object-cover rounded-lg"
            />
            <button onClick={prev} className="absolute left-2 top-1/2 text-white bg-black/50 px-2 rounded">
                ‹
            </button>
            <button onClick={next} className="absolute right-2 top-1/2 text-white bg-black/50 px-2 rounded">
                ›
            </button>
        </div>
    );
}
