import { useEffect, useState } from "react";
import { BookOpenCheck, CheckCircle2, Clock3, FileText } from "lucide-react";
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import PageHeader from "../components/PageHeader";
import api from "../api/axios";

interface Stats {
  total: number;
  approved: number;
  draft: number;
  rejected: number;
  submitted: number;
}

const numberFormatter = new Intl.NumberFormat("en-US");

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    async function fetchStats() {
      try {
        const response = await api.get<Stats>("/enrollments/stats", { signal: controller.signal });
        setStats(response.data);
      } catch {
        if (!controller.signal.aborted) setError(true);
      }
    }
    void fetchStats();
    return () => controller.abort();
  }, []);

  const chartData = [
    { name: "Approved", value: stats?.approved ?? 0, color: "#059669" },
    { name: "Submitted", value: stats?.submitted ?? 0, color: "#2563eb" },
    { name: "Draft", value: stats?.draft ?? 0, color: "#d97706" },
    { name: "Rejected", value: stats?.rejected ?? 0, color: "#dc2626" },
  ];

  const cards = [
    { label: "Total KRS", value: stats?.total, icon: BookOpenCheck, color: "bg-slate-100 text-slate-700" },
    { label: "Approved", value: stats?.approved, icon: CheckCircle2, color: "bg-emerald-50 text-emerald-700" },
    { label: "Submitted", value: stats?.submitted, icon: FileText, color: "bg-blue-50 text-blue-700" },
    { label: "Draft", value: stats?.draft, icon: Clock3, color: "bg-amber-50 text-amber-700" },
  ];

  return (
    <div>
      <PageHeader title="Academic overview" breadcrumb="Dashboard / Overview" description="Monitor KRS activity, workflow distribution, and academic operations for the active semester." />
      <div className="mt-5 flex flex-col gap-1 border-l-2 border-emerald-600 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between"><p className="text-sm font-semibold text-slate-900">Active period · 2026/2027 Ganjil</p><p className="text-xs text-slate-500">Enrollment data for the current semester</p></div>

      {error && <div role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">Dashboard statistics could not be loaded. The enrollment workspace remains available.</div>}

      <section aria-label="Enrollment statistics" className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <article key={label} className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="flex items-start justify-between"><div><p className="text-sm font-medium text-gray-500">{label}</p>{value === undefined ? <div className="mt-3 h-8 w-24 animate-pulse rounded bg-gray-100" /> : <p className="mt-2 text-3xl font-semibold tracking-tight text-gray-950">{numberFormatter.format(value)}</p>}</div><span className={`rounded-xl p-3 ${color}`}><Icon className="h-5 w-5" /></span></div>
          </article>
        ))}
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_minmax(300px,0.5fr)]">
        <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <div><h2 className="font-semibold text-gray-950">Status distribution</h2><p className="mt-1 text-sm text-gray-500">Current enrollment workflow composition.</p></div>
          <div className="mt-4 h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart><Pie data={chartData} dataKey="value" nameKey="name" innerRadius={78} outerRadius={118} paddingAngle={3} strokeWidth={0}>{chartData.map((item) => <Cell key={item.name} fill={item.color} />)}</Pie><Tooltip formatter={(value) => numberFormatter.format(Number(value))} contentStyle={{ borderRadius: 12, borderColor: "#e5e7eb", boxShadow: "0 10px 25px rgba(15,23,42,.08)" }} /><Legend verticalAlign="bottom" iconType="circle" /></PieChart>
            </ResponsiveContainer>
          </div>
        </article>

        <aside className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="font-semibold text-gray-950">Workflow summary</h2><p className="mt-1 text-sm text-gray-500">Records by current decision state.</p>
          <div className="mt-5 space-y-4">{chartData.map((item) => { const percentage = stats?.total ? Math.round((item.value / stats.total) * 100) : 0; return <div key={item.name}><div className="flex items-center justify-between text-sm"><span className="flex items-center gap-2 font-medium text-gray-700"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />{item.name}</span><span className="text-gray-500">{percentage}%</span></div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-gray-100"><div className="h-full rounded-full transition-all" style={{ width: `${percentage}%`, backgroundColor: item.color }} /></div></div>; })}</div>
        </aside>
      </section>
    </div>
  );
}
