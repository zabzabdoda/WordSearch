import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import WordSearchMaker from "./wordsearchmaker";
import WordSearchGame from "./wordsearchplay";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

function Header() {
  return (
    <header className="nav-header">
      <nav className="nav-top">
        <h1 className="nav-items">Word Finder</h1>
      </nav>
    </header>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<WordSearchMaker />} />
        <Route path="/play/:state" element={<WordSearchGame />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);