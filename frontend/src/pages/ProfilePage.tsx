import { useQuery } from "@tanstack/react-query";
import { Calendar, Mail, Shield } from "lucide-react";
import { Card } from "../components/ui/Card";
import { useAuth } from "../contexts/AuthContext";
import { api } from "../lib/api";
import type { HistoryItem } from "../types/api";

export default function ProfilePage() {
  const { user } = useAuth();
  const { data = [] } = useQuery({ queryKey: ["history"], queryFn: async () => (await api.get<HistoryItem[]>("/api/history")).data });
  return (
    <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
      <Card>
        <div className="grid size-20 place-items-center rounded-lg bg-cyan-600 text-3xl font-black text-white">{user?.name.charAt(0)}</div>
        <h1 className="mt-5 text-2xl font-black">{user?.name}</h1>
        <p className="text-slate-500">{user?.email}</p>
      </Card>
      <div className="grid gap-4 md:grid-cols-3">
        <Card><Mail className="text-cyan-600" /><p className="mt-4 font-bold">Email</p><p className="text-sm text-slate-500">{user?.email}</p></Card>
        <Card><Shield className="text-emerald-600" /><p className="mt-4 font-bold">Role</p><p className="text-sm text-slate-500">{user?.role}</p></Card>
        <Card><Calendar className="text-pink-600" /><p className="mt-4 font-bold">Joined</p><p className="text-sm text-slate-500">{user && new Date(user.created_at).toLocaleDateString()}</p></Card>
        <Card className="md:col-span-3"><h2 className="font-bold">Prediction Statistics</h2><p className="mt-4 text-4xl font-black">{data.length}</p><p className="text-sm text-slate-500">Predictions saved in your account.</p></Card>
      </div>
    </div>
  );
}

