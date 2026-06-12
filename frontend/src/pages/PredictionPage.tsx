import { FormEvent, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { WandSparkles } from "lucide-react";
import { Card } from "../components/ui/Card";
import { api } from "../lib/api";
import { formatNumber, toFraction } from "../lib/utils";
import type { Prediction } from "../types/api";

const labels: Record<string, string> = {
  cement: "Cement",
  blast_furnace_slag: "Slag",
  fly_ash: "Fly Ash",
  water: "Water",
  superplasticizer: "Superplasticizer",
  coarse_aggregate: "Coarse Aggregate",
  fine_aggregate: "Fine Aggregate",
};

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

  const total = result ? (result.cement + result.blast_furnace_slag + result.fly_ash + result.water + result.superplasticizer + result.coarse_aggregate + result.fine_aggregate) : 0;

  const chartData = result ? Object.entries(result).filter(([key]) => labels[key]).map(([key, value]) => ({ 
    name: labels[key], 
    value: total > 0 ? (Number(value) / total) : 0 
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
            {Object.entries(labels).map(([key, label]) => <Card key={key}><p className="text-sm text-slate-500">{label} Fraction</p><p className="mt-2 text-2xl font-black">{toFraction(Number(result[key as keyof Prediction]), total)}</p></Card>)}
          </motion.div>
        )}
        <Card className="min-h-[360px]">
          <h2 className="mb-4 font-bold">Ingredient Weight Fractions (Sum = 1.0)</h2>
          {result ? <ResponsiveContainer width="100%" height={280}><BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" tick={{ fontSize: 11 }} /><YAxis /><Tooltip /><Bar dataKey="value" fill="#0891b2" radius={[4, 4, 0, 0]} /></BarChart></ResponsiveContainer> : <div className="grid h-64 place-items-center text-slate-500">Run a prediction to view results.</div>}
        </Card>
      </div>
    </div>
  );
}
