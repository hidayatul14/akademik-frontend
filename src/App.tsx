import { Routes, Route } from "react-router-dom";
import { lazy, Suspense, useState } from "react";
import Sidebar from "./layouts/Sidebar";
import Header from "./layouts/Header";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const StudentsPage = lazy(() => import("./pages/StudentPage"));
const CoursesPage = lazy(() => import("./pages/CoursesPage"));
const EnrollmentsPage = lazy(() => import("./pages/EnrollmentsPage"));

function RouteFallback() {
  return <div className="mt-8 h-64 animate-pulse rounded-xl border border-gray-200 bg-white shadow-sm" aria-label="Loading page" />;
}

export default function App() {
  const [navigationOpen, setNavigationOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-gray-50">
      <Sidebar open={navigationOpen} onClose={() => setNavigationOpen(false)} />
      <div className="min-w-0 flex-1">
        <Header onOpenNavigation={() => setNavigationOpen(true)} />
        <main className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
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
