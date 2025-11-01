import React from 'react'
import EditData from '../components/Edit File/EditData'

import { useNavigate } from "react-router-dom";

export const MainPage=()=>{
    const navigate= useNavigate();
    const editData=()=>{
navigate("/editfile")
    }

    return(
        <>
        <div>
            <button onClick={editData}>Edit Data</button>
        </div>
        </>
    )
}