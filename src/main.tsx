import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { SpeedInsights } from "@vercel/speed-insights/react"
import App from "./App";
import "./assets/tailwind.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
  <SpeedInsights/>
    <div id="app-container" className="bg-gray-100 min-h-screen flex">
      <App />
    </div>
  </BrowserRouter>,
);
