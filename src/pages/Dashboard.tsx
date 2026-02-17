import { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import api from "../api/axios";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { FaUsers, FaCheckCircle, FaFileAlt, FaTimesCircle } from "react-icons/fa";

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const res = await api.get("/enrollments/stats");
    setStats(res.data);
  };

  const chartData = [
    { name: "Approved", value: stats?.approved ?? 0 },
    { name: "Draft", value: stats?.draft ?? 0 },
    { name: "Rejected", value: stats?.rejected ?? 0 },
    { name: "Submitted", value: stats?.submitted ?? 0 },
  ];

  return (
    <div>
      <PageHeader
        title="Dashboard"
        breadcrumb="Dashboard / Overview"
      />

      {/* STAT CARDS */}
      <div className="grid md:grid-cols-4 gap-6 mt-6">
        <StatCard
          title="Total Enrollment"
          value={stats?.total ?? 0}
          icon={<FaUsers />}
          color="bg-hijau"
        />
        <StatCard
          title="Approved"
          value={stats?.approved ?? 0}
          icon={<FaCheckCircle />}
          color="bg-biru"
        />
        <StatCard
          title="Draft"
          value={stats?.draft ?? 0}
          icon={<FaFileAlt />}
          color="bg-kuning"
        />
        <StatCard
          title="Rejected"
          value={stats?.rejected ?? 0}
          icon={<FaTimesCircle />}
          color="bg-merah"
        />
      </div>

      {/* CHART */}
      <div className="bg-white p-6 rounded-xl shadow mt-8">
        <h2 className="text-lg font-semibold mb-4">Status Distribution</h2>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={chartData} dataKey="value" outerRadius={100}>
              <Cell fill="#00B074" />
              <Cell fill="#3b82f6" />
              <Cell fill="#f59e0b" />
              <Cell fill="#ef4444" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color,
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="flex items-center space-x-5 bg-white rounded-xl shadow-md p-6">
      <div className={`${color} text-white text-2xl rounded-full p-4`}>
        {icon}
      </div>
      <div>
        <h2 className="text-2xl font-bold">{value}</h2>
        <p className="text-gray-400">{title}</p>
      </div>
    </div>
  );
}
