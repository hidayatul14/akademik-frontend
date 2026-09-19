import { useEffect, useState } from "react";
import { ArrowRight, BookOpen, GraduationCap, Library, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import PageHeader from "../components/PageHeader";

interface Stats {
  total: number;
  approved: number;
  draft: number;
  rejected: number;
  submitted: number;
}

const numberFormatter = new Intl.NumberFormat("id-ID");

const destinations = [
  { to: "/enrollments", label: "Kelola KRS", description: "Tinjau pengajuan, status, dan data registrasi.", icon: BookOpen },
  { to: "/students", label: "Data mahasiswa", description: "Perbarui identitas dan kontak mahasiswa.", icon: GraduationCap },
  { to: "/courses", label: "Mata kuliah", description: "Kelola kode, nama, dan jumlah SKS.", icon: Library },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchStats() {
      setError(false);
      try {
        const response = await api.get<Stats>("/enrollments/stats", { signal: controller.signal });
        setStats(response.data);
      } catch {
        if (!controller.signal.aborted) setError(true);
      }
    }

    void fetchStats();
    return () => controller.abort();
  }, [refreshKey]);

  const statusRows = [
    { label: "Disetujui", value: stats?.approved ?? 0, color: "bg-emerald-600", dot: "bg-emerald-600" },
    { label: "Diajukan", value: stats?.submitted ?? 0, color: "bg-sky-600", dot: "bg-sky-600" },
    { label: "Draf", value: stats?.draft ?? 0, color: "bg-amber-500", dot: "bg-amber-500" },
    { label: "Ditolak", value: stats?.rejected ?? 0, color: "bg-rose-600", dot: "bg-rose-600" },
  ];

  return (
    <div>
      <PageHeader
        title="Ringkasan Akademik"
        breadcrumb="Beranda / Ringkasan"
        description="Gambaran data KRS dan akses cepat ke pekerjaan akademik."
      />

      <section aria-label="Total data KRS" className="mt-7 overflow-hidden rounded-xl bg-slate-900 text-white">
        <div className="grid gap-8 px-6 py-7 sm:px-8 sm:py-9 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300">Seluruh periode akademik</p>
            <h2 className="mt-3 font-poppins text-2xl font-semibold tracking-tight sm:text-3xl">Pengelolaan KRS, lebih terarah.</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">Pantau status pengajuan dan lanjutkan pekerjaan tanpa perlu berpindah-pindah sistem.</p>
            <Link to="/enrollments" className="mt-6 inline-flex items-center gap-2 rounded-md bg-emerald-500 px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900">
              Buka pengelolaan KRS <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="border-t border-slate-700 pt-6 lg:min-w-52 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">Total data KRS</p>
            {stats ? <p className="mt-2 font-poppins text-5xl font-semibold tracking-tight tabular-nums sm:text-6xl">{numberFormatter.format(stats.total)}</p> : error ? <p className="mt-2 text-5xl text-slate-500">—</p> : <div className="mt-4 h-14 w-36 animate-pulse rounded bg-slate-700" />}
            <p className="mt-2 text-xs text-slate-400">Mencakup seluruh tahun ajaran</p>
          </div>
        </div>
      </section>

      {error && (
        <div role="alert" className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <span>Statistik belum dapat dimuat. Anda tetap dapat mengelola data KRS.</span>
          <button type="button" onClick={() => setRefreshKey((value) => value + 1)} className="inline-flex items-center gap-1.5 font-semibold hover:underline"><RefreshCw className="h-4 w-4" /> Coba lagi</button>
        </div>
      )}

      <div className="mt-8 grid gap-8 xl:grid-cols-[minmax(0,1.4fr)_minmax(300px,0.8fr)]">
        <section aria-labelledby="status-title">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 id="status-title" className="font-poppins text-lg font-semibold text-slate-950">Status pengajuan</h2>
              <p className="mt-1 text-sm text-slate-500">Sebaran data KRS dari seluruh periode akademik.</p>
            </div>
          </div>
          <div className="mt-4 divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white px-5">
            {statusRows.map((row) => {
              const percentage = stats?.total ? Math.round((row.value / stats.total) * 100) : 0;
              return (
                <div key={row.label} className="grid gap-3 py-4 sm:grid-cols-[110px_minmax(0,1fr)_minmax(120px,auto)] sm:items-center">
                  <span className="flex items-center gap-2.5 text-sm font-medium text-slate-700"><span className={`h-2.5 w-2.5 rounded-full ${row.dot}`} />{row.label}</span>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100" aria-label={`${row.label}: ${percentage}%`} role="img"><div className={`h-full rounded-full ${row.color}`} style={{ width: `${percentage}%` }} /></div>
                  <span className="whitespace-nowrap text-right text-sm tabular-nums text-slate-600">{stats ? numberFormatter.format(row.value) : "—"} {stats && <span className="text-slate-400">({percentage}%)</span>}</span>
                </div>
              );
            })}
          </div>
        </section>

        <section aria-labelledby="access-title">
          <h2 id="access-title" className="font-poppins text-lg font-semibold text-slate-950">Akses cepat</h2>
          <p className="mt-1 text-sm text-slate-500">Lanjutkan pekerjaan dari halaman yang tepat.</p>
          <div className="mt-4 divide-y divide-slate-100 rounded-lg border border-slate-200 bg-white">
            {destinations.map(({ to, label, description, icon: Icon }) => (
              <Link key={to} to={to} className="group flex items-center gap-4 px-5 py-4 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-600">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-slate-100 text-slate-700 group-hover:bg-emerald-50 group-hover:text-emerald-700"><Icon className="h-5 w-5" /></span>
                <span className="min-w-0 flex-1"><span className="block text-sm font-semibold text-slate-900">{label}</span><span className="mt-0.5 block text-xs leading-5 text-slate-500">{description}</span></span>
                <ArrowRight className="h-4 w-4 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-emerald-700" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
