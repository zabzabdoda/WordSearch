import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import WordSearchMaker from "./wordsearchmaker";
import WordSearchGame from "./wordsearchplay";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Home from "./homepage";
import Header from "./header";
/*
function Header() {
  return (
    <header className="nav-header">
      <nav className="nav-top" style={{ display: "flex" }}>
        <h1 onClick={() => { window.location.href = "https://zabzabdoda.com/" }} style={{ cursor: "pointer" }} className="nav-items">Word Search</h1>
      </nav>
    </header>
  );
}*/

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<WordSearchMaker />} />
        <Route path="/play/:state" element={<WordSearchGame data-bs-theme="dark" />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);