import React, { useState } from "react";
import Insert from "./Insert";

const InsertProduct = () => {
  const [isInsert, setIsInsert] = useState(false);

  const handleClose = () => setIsInsert(false);

  return (
    <div className="p-6">
      <button
        onClick={() => setIsInsert(true)}
        className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg transition-all duration-200"
      >
       ➕Insert Product
      </button>

      {isInsert && <Insert onClose={handleClose} />}
    </div>
  );
};

export default InsertProduct;
