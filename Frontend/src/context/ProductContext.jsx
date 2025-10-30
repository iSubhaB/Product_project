import { createContext, useContext, useState } from "react";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
    const [filters, setFilters] = useState({
        search: "",
        categoryId: "",
        subCategoryId: "",
        page: 1,
    });

    return (
        <ProductContext.Provider value={{ filters, setFilters }}>
            {children}
        </ProductContext.Provider>
    );
};

export const useProduct = () => useContext(ProductContext);
