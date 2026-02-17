import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./assets/tailwind.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <div id="app-container" className="bg-gray-100 min-h-screen flex">
      <App />
    </div>
  </BrowserRouter>,
);
