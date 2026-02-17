import { Routes, Route } from "react-router-dom";
import Sidebar from "./layouts/Sidebar";
import Header from "./layouts/Header";
import Dashboard from "./pages/Dashboard";
import EnrollmentsPage from "./pages/EnrollmentsPage";

export default function App() {
  return (
    <div id="layout-wrapper" className="flex flex-row flex-1">
      <Sidebar />

      <div id="main-content" className="flex-1 p-6">
        <Header />

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/enrollments" element={<EnrollmentsPage />} />
        </Routes>
      </div>
    </div>
  );
}
