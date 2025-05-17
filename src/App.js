import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
// import "react-quill/dist/quill.snow.css";
import Home from "./pages/Home";
import Createblog from "./pages/Createblog";
import { BrowserRouter,Routes,Route } from "react-router-dom";
import './App.css'
import { Toaster } from "react-hot-toast";
import Viewblog from "./pages/Viewblog";
function App() {
  return (
    <>
    <Toaster
          position="top-right"
          toastOptions={{
            success: {
              duration: 4000,
              theme: {
                primary: '#4aed88',
              },
            },
            error: {
              duration: 4000,
              theme: {
                primary: '#ff4d4f',
              },
            },
          }}
        />

    <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home/>}/>
            <Route path="/createblog" element={<Createblog/>}/>
            <Route path="/createblog/:id" element={<Createblog/>}/>
            <Route path="/viewblog/:id" element={<Viewblog/>}/>
        </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
