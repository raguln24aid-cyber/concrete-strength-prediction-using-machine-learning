import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import jsPDF from "jspdf";
import { Download, FileText, History, Search, Trash2 } from "lucide-react";
import { Card } from "../components/ui/Card";
import { api } from "../lib/api";
import { formatNumber } from "../lib/utils";
import type { HistoryItem } from "../types/api";

export default function HistoryPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const queryClient = useQueryClient();
  const { data = [] } = useQuery({ queryKey: ["history"], queryFn: async () => (await api.get<HistoryItem[]>("/api/history?limit=100")).data });
  const filtered = useMemo(() => data.filter((item) => String(item.strength_input).includes(search)), [data, search]);
  const pageItems = filtered.slice(page * 10, page * 10 + 10);
  const deleteMutation = useMutation({ mutationFn: async (id: string) => api.delete(`/api/history/${id}`), onSuccess: () => queryClient.invalidateQueries({ queryKey: ["history"] }) });

  function exportCsv() {
    const header = Object.keys(data[0] || {}).join(",");
    const rows = data.map((row) => Object.values(row).join(",")).join("\n");
    const blob = new Blob([`${header}\n${rows}`], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "prediction_history.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  function exportPdf() {
    const pdf = new jsPDF();
    pdf.text("ConcreteMix AI Prediction History", 14, 18);
    data.slice(0, 25).forEach((item, index) => {
      pdf.text(`${item.strength_input} MPa -> cement ${formatNumber(item.predicted_cement)} kg/m³, water ${formatNumber(item.predicted_water)} kg/m³`, 14, 30 + index * 8)
    });
    pdf.save("prediction_history.pdf");
  }

  return (
    <div className="space-y-5">
    <Card className="border-l-4 border-l-indigo-500 shadow-xl shadow-indigo-500/5">
      <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30"><History size={20} /></div>
          <h1 className="text-2xl font-black">Prediction History <span className="text-xs font-normal text-slate-500 uppercase tracking-wider ml-1">(kg/m³)</span></h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="relative group"><Search className="absolute left-3 top-3 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={16} /><input className="input w-full md:w-56 pl-9 focus:ring-2 focus:ring-indigo-500/20" placeholder="Search strength" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
          <button className="btn-secondary bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/20 dark:text-emerald-400" onClick={exportCsv} disabled={!data.length}><Download size={16} /> CSV</button>
          <button className="btn-secondary bg-rose-50 text-rose-700 hover:bg-rose-100 dark:bg-rose-950/20 dark:text-rose-400" onClick={exportPdf} disabled={!data.length}><FileText size={16} /> PDF</button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="text-slate-500 border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="py-3 pl-4 font-semibold">Strength (MPa)</th>
              <th className="font-semibold">Cement (kg/m³)</th>
              <th className="font-semibold">Slag (kg/m³)</th>
              <th className="font-semibold">Fly Ash (kg/m³)</th>
              <th className="font-semibold">Water (kg/m³)</th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody>{pageItems.map((item) => {
            return (
              <tr key={item.id} className="group border-b border-slate-200/70 dark:border-slate-800 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/10 transition-colors">
                <td className="py-4 pl-4 font-bold text-indigo-600 dark:text-indigo-400">{item.strength_input}</td>
                <td className="font-medium text-slate-700 dark:text-slate-300">{formatNumber(item.predicted_cement)}</td>
                <td className="text-slate-600 dark:text-slate-400">{formatNumber(item.predicted_blast_furnace_slag)}</td>
                <td className="text-slate-600 dark:text-slate-400">{formatNumber(item.predicted_fly_ash)}</td>
                <td className="text-slate-600 dark:text-slate-400">{formatNumber(item.predicted_water)}</td>
                <td className="pr-4"><button className="btn-secondary size-9 px-0 hover:border-red-500 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => deleteMutation.mutate(item.id)} aria-label="Delete"><Trash2 size={15} /></button></td>
              </tr>
            )
          })}</tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button className="btn-secondary" onClick={() => setPage(Math.max(0, page - 1))}>Previous</button>
        <button className="btn-secondary" onClick={() => setPage(page + 1)} disabled={(page + 1) * 10 >= filtered.length}>Next</button>
      </div>
    </Card>
    </div>
  );
}
