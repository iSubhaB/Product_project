import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import EditData from "../Edit File/InsertProduct"; // ✅ corrected import
import ProductList from "../../pages/ProductList";
import InsertProduct from "../Edit File/InsertProduct";

export  const Rules = () => {
  return (
    <BrowserRouter>
     <ProductList /> 
      <Routes>
        <Route path="/editfile" element={<InsertProduct/>} />
      </Routes>
    </BrowserRouter>
  );
};
