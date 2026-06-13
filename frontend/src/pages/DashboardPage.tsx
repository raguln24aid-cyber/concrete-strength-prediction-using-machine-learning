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
    <div className="space-y-5">
      <div className="grid gap-4 md:grid-cols-4">
        <Card><Activity className="text-cyan-600" /><p className="mt-4 text-3xl font-black">{history.length}</p><p className="text-sm text-slate-500">Total Predictions</p></Card>
        <Card><Clock className="text-emerald-600" /><p className="mt-4 text-3xl font-black">{history.slice(0, 7).length}</p><p className="text-sm text-slate-500">Recent Predictions</p></Card>
        <Card><BarChart3 className="text-pink-600" /><p className="mt-4 text-lg font-bold">{modelInfo.best_model || "Model"}</p><p className="text-sm text-slate-500">Best Estimator</p></Card>
        <Card><User className="text-violet-600" /><p className="mt-4 text-lg font-bold">{user?.role}</p><p className="text-sm text-slate-500">Role</p></Card>
      </div>
      <Card>
        <h2 className="mb-4 font-bold">Recent Predictions</h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead className="text-slate-500"><tr><th className="py-2">Strength (MPa)</th><th>Cement (kg/m³)</th><th>Water (kg/m³)</th><th>Date</th></tr></thead>
            <tbody>{history.slice(0, 6).map((item) => {
              return <tr key={item.id} className="border-t border-slate-200/70 dark:border-slate-800"><td className="py-3 font-semibold text-cyan-700 dark:text-cyan-400">{item.strength_input}</td><td>{formatNumber(item.predicted_cement)}</td><td>{formatNumber(item.predicted_water)}</td><td>{new Date(item.created_at).toLocaleString()}</td></tr>
            })}</tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
