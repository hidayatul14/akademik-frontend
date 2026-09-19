import { Routes, Route } from "react-router-dom";
import { lazy, Suspense, useState } from "react";
import Sidebar from "./layouts/Sidebar";
import Header from "./layouts/Header";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const StudentsPage = lazy(() => import("./pages/StudentPage"));
const CoursesPage = lazy(() => import("./pages/CoursesPage"));
const EnrollmentsPage = lazy(() => import("./pages/EnrollmentsPage"));

function RouteFallback() {
  return <div className="mt-8 h-64 animate-pulse rounded-xl border border-gray-200 bg-white shadow-sm" aria-label="Memuat halaman" />;
}

export default function App() {
  const [navigationOpen, setNavigationOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-[#f5f7f8]">
      <Sidebar open={navigationOpen} onClose={() => setNavigationOpen(false)} />
      <div className="min-w-0 flex-1">
        <Header onOpenNavigation={() => setNavigationOpen(true)} />
        <main className="mx-auto w-full max-w-[1480px] px-4 py-7 sm:px-6 lg:px-10 lg:py-9">
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/students" element={<StudentsPage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/enrollments" element={<EnrollmentsPage />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </div>
  );
}
