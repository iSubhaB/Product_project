import { useState, useEffect } from "react";

const ImageCarousel = ({ images, name }) => {
  const [index, setIndex] = useState(0);
  const [hover, setHover] = useState(false);


  useEffect(() => {
    if (!images?.length || hover) return;
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 3000);
    return () => clearInterval(timer);
  }, [images, hover]);

  if (!images?.length) {
    return (
      <img
        src="/placeholder.png"
        alt="No image"
        className="object-cover w-full h-full"
      />
    );
  }

  return (
    <div
      className="relative w-full h-full overflow-hidden group"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Main image */}
      <img
        src={images[index]}
        alt={name}
        className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
      />

      {/* Prev / Next buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIndex((i) => (i - 1 + images.length) % images.length);
            }}
            className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-700 rounded-full px-2 shadow"
          >
            ‹
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setIndex((i) => (i + 1) % images.length);
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-gray-700 rounded-full px-2 shadow"
          >
            ›
          </button>
        </>
      )}

      {/* Dots indicator */}
      {images.length > 1 && (
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
          {images.map((_, i) => (
            <div
              key={i}
              className={`h-2 w-2 rounded-full ${
                i === index ? "bg-indigo-600 w-4" : "bg-gray-300"
              } transition-all`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageCarousel;
