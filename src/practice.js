import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Header() {
  return (
    <header className="nav-header">
      <nav className="nav-top">
        <img className="image" src="./logo192.png" alt="React logo" />
        <ul className="nav-items">
          <li>Pricing</li>
        </ul>
      </nav>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <small>Copyright 2024 Massey development. All rights reserved.</small>
    </footer>
  );
}

function MainContent() {
  return (
    <div className="main-content">
      <h1>Reasons Why React is Cool</h1>
      <ol>
        <li>It is reactive and dynamic, making for a good website</li>
        <li>
          It's a hot topic in programming right now and everything is moving to
          the web
        </li>
        <li>
          It's a good way of making a UI for a web server with a backend of
          Spring Boot
        </li>
      </ol>
    </div>
  );
}

function Page() {
  return (
    <>
      <Header />
      <MainContent />
      <Footer />
    </>
  );
}

ReactDOM.render(<Page />, document.getElementById("root"));
