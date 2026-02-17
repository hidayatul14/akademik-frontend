import EnrollmentsPage from "./pages/EnrollmentsPage";

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-800">
            Sistem Akademik
          </h1>
          <span className="text-sm text-gray-500">Dashboard KRS</span>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto p-6">
        <EnrollmentsPage />
      </main>
    </div>
  );
}

export default App;
