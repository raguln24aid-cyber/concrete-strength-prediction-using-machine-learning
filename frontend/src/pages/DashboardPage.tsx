import { useQuery } from "@tanstack/react-query";
import { Activity, BarChart3, Clock, User } from "lucide-react";
import { Card } from "../components/ui/Card";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../lib/api";
import { formatNumber } from "../lib/utils";
import type { HistoryItem } from "../types/api";

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: history = [] } = useQuery({ queryKey: ["history"], queryFn: async () => (await api.get<HistoryItem[]>("/api/history")).data });
  const { data: modelInfo = {} } = useQuery({ queryKey: ["model-info"], queryFn: async () => (await api.get("/api/model-info")).data });

  return (
    <div className="space-y-6">
      <header className="mb-2">
        <h1 className="text-3xl font-black tracking-tight">Welcome back, <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">{user?.name}</span></h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Here's a summary of your concrete mix design activities.</p>
      </header>

      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-t-4 border-t-cyan-500 bg-gradient-to-b from-cyan-50/50 to-transparent dark:from-cyan-950/10">
          <Activity className="text-cyan-600" />
          <p className="mt-4 text-3xl font-black">{history.length}</p>
          <p className="text-sm text-slate-500">Total Predictions</p>
        </Card>
        <Card className="border-t-4 border-t-emerald-500 bg-gradient-to-b from-emerald-50/50 to-transparent dark:from-emerald-950/10">
          <Clock className="text-emerald-600" />
          <p className="mt-4 text-3xl font-black">{history.slice(0, 7).length}</p>
          <p className="text-sm text-slate-500">Recent Predictions</p>
        </Card>
        <Card className="border-t-4 border-t-pink-500 bg-gradient-to-b from-pink-50/50 to-transparent dark:from-pink-950/10">
          <BarChart3 className="text-pink-600" />
          <p className="mt-4 text-lg font-bold truncate">{modelInfo.best_model || "Model"}</p>
          <p className="text-sm text-slate-500">Best Estimator</p>
        </Card>
        <Card className="border-t-4 border-t-violet-500 bg-gradient-to-b from-violet-50/50 to-transparent dark:from-violet-950/10">
          <User className="text-violet-600" />
          <p className="mt-4 text-lg font-bold">{user?.role}</p>
          <p className="text-sm text-slate-500">Role</p>
        </Card>
      </div>
      <Card>
        <h2 className="mb-4 font-bold">Recent Predictions</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm">
            <thead className="text-slate-500">
              <tr>
                <th className="py-3 font-semibold">Strength (MPa)</th>
                <th className="font-semibold">Cement (kg/m³)</th>
                <th className="font-semibold">Water (kg/m³)</th>
                <th className="font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>{history.slice(0, 6).map((item) => {
              return <tr key={item.id} className="border-t border-slate-200/70 dark:border-slate-800"><td className="py-3 font-semibold text-cyan-700 dark:text-cyan-400">{item.strength_input}</td><td>{formatNumber(item.predicted_cement)}</td><td>{formatNumber(item.predicted_water)}</td><td>{new Date(item.created_at).toLocaleString()}</td></tr>
            })}</tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
