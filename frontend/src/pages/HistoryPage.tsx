import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import jsPDF from "jspdf";
import { Download, FileText, Search, Trash2 } from "lucide-react";
import { Card } from "../components/ui/Card";
import { api } from "../lib/api";
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
    data.slice(0, 25).forEach((item, index) => pdf.text(`${item.strength_input} MPa -> cement ${item.predicted_cement}, water ${item.predicted_water}`, 14, 30 + index * 8));
    pdf.save("prediction_history.pdf");
  }

  return (
    <Card>
      <div className="mb-5 flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <h1 className="text-2xl font-black">Prediction History</h1>
        <div className="flex flex-wrap gap-2">
          <div className="relative"><Search className="absolute left-3 top-3 text-slate-400" size={16} /><input className="input w-56 pl-9" placeholder="Search strength" value={search} onChange={(e) => setSearch(e.target.value)} /></div>
          <button className="btn-secondary" onClick={exportCsv} disabled={!data.length}><Download size={16} /> CSV</button>
          <button className="btn-secondary" onClick={exportPdf} disabled={!data.length}><FileText size={16} /> PDF</button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="text-slate-500"><tr><th className="py-2">Strength</th><th>Cement</th><th>Slag</th><th>Fly Ash</th><th>Water</th><th></th></tr></thead>
          <tbody>{pageItems.map((item) => <tr key={item.id} className="border-t border-slate-200/70 dark:border-slate-800"><td className="py-3">{item.strength_input}</td><td>{item.predicted_cement}</td><td>{item.predicted_blast_furnace_slag}</td><td>{item.predicted_fly_ash}</td><td>{item.predicted_water}</td><td><button className="btn-secondary size-9 px-0" onClick={() => deleteMutation.mutate(item.id)} aria-label="Delete"><Trash2 size={15} /></button></td></tr>)}</tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-end gap-2">
        <button className="btn-secondary" onClick={() => setPage(Math.max(0, page - 1))}>Previous</button>
        <button className="btn-secondary" onClick={() => setPage(page + 1)} disabled={(page + 1) * 10 >= filtered.length}>Next</button>
      </div>
    </Card>
  );
}
