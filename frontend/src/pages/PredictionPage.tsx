import { FormEvent, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { WandSparkles } from "lucide-react";
import { Card } from "../components/ui/Card";
import { api } from "../lib/api";
import { formatNumber } from "../lib/utils";
import type { Prediction } from "../types/api";

const ingredientMeta: Record<string, { label: string; color: string; border: string }> = {
  cement: { label: "Cement", color: "text-cyan-600", border: "border-l-cyan-500" },
  blast_furnace_slag: { label: "Slag", color: "text-blue-600", border: "border-l-blue-500" },
  fly_ash: { label: "Fly Ash", color: "text-indigo-600", border: "border-l-indigo-500" },
  water: { label: "Water", color: "text-sky-600", border: "border-l-sky-500" },
  superplasticizer: { label: "Superplasticizer", color: "text-violet-600", border: "border-l-violet-500" },
  coarse_aggregate: { label: "Coarse Aggregate", color: "text-emerald-600", border: "border-l-emerald-500" },
  fine_aggregate: { label: "Fine Aggregate", color: "text-teal-600", border: "border-l-teal-500" },
};

const CHART_COLORS = ["#0891b2", "#2563eb", "#4f46e5", "#0ea5e9", "#7c3aed", "#059669", "#0d9488"];

export default function PredictionPage() {
  const [strength, setStrength] = useState<number | "">(40);
  const [result, setResult] = useState<Prediction | null>(null);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async () => (await api.post<Prediction>("/api/predict", { strength: Number(strength) })).data,
    onSuccess(data) {
      setResult(data);
      queryClient.invalidateQueries({ queryKey: ["history"] });
    }
  });

  function submit(event: FormEvent) {
    event.preventDefault();
    if (strength === "") return;
    mutation.mutate();
  }

  const chartData = result ? Object.entries(result).filter(([key]) => ingredientMeta[key]).map(([key, value]) => ({ 
    name: ingredientMeta[key].label, 
    value: Number(value) 
  })) : [];

  return (
    <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">
      <Card>
        <h1 className="text-2xl font-black">Predict Mix</h1>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <label className="text-sm font-semibold">Target Strength</label>
          <input className="input" type="number" min="1" max="150" step="0.1" value={strength} onChange={(e) => setStrength(e.target.value === "" ? "" : Number(e.target.value))} />
          <button className="btn-primary w-full" disabled={mutation.isPending || strength === ""}>{mutation.isPending ? "Predicting..." : <>Predict <WandSparkles size={16} /></>}</button>
        </form>
        {mutation.isError && <p className="mt-4 text-sm text-red-600">Prediction failed. Confirm the backend and MongoDB are running.</p>}
      </Card>
      <div className="space-y-5">
        {result && (
          <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Object.entries(ingredientMeta).map(([key, meta]) => (
              <Card key={key} className={`border-l-4 ${meta.border}`}>
                <p className={`text-sm font-medium ${meta.color}`}>{meta.label} (kg/m³)</p>
                <p className="mt-2 text-2xl font-black">{formatNumber(Number(result[key as keyof Prediction]))}</p>
              </Card>
            ))}
          </motion.div>
        )}
        <Card className="min-h-[360px]">
          <h2 className="mb-4 font-bold">Ingredient Weights (kg/m³)</h2>
          {result ? (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="grid h-64 place-items-center text-slate-500">Run a prediction to view results.</div>
          )}
        </Card>
      </div>
    </div>
  );
}
