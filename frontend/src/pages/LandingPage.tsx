import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, BarChart3, Database, Lock, Sparkles } from "lucide-react";
import { Card } from "../components/ui/Card";

const features = [
  { icon: Sparkles, title: "Inverse mix design", text: "Estimate ingredient quantities from a target compressive strength." },
  { icon: Lock, title: "Secure workspace", text: "JWT authentication, bcrypt hashing, protected APIs, and role-ready access." },
  { icon: Database, title: "MongoDB history", text: "Every prediction is saved for review, export, and future analytics." }
];

export default function LandingPage() {
  return (
    <div className="min-h-screen text-slate-950 dark:text-slate-100">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5">
        <Link to="/" className="text-xl font-black">ConcreteMix AI</Link>
        <div className="flex gap-2">
          <Link className="btn-secondary" to="/login">Login</Link>
          <Link className="btn-primary" to="/register">Start</Link>
        </div>
      </nav>
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-16 pt-10 lg:grid-cols-[1.05fr_0.95fr]">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="max-w-4xl text-5xl font-black leading-tight tracking-normal md:text-7xl">ConcreteMix AI</h1>
          <p className="mt-5 max-w-2xl text-lg text-slate-600 dark:text-slate-300">
            A production-ready AI application that converts desired concrete strength into an actionable ingredient mix with secure history tracking.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link className="btn-primary" to="/register">Create Account <ArrowRight size={16} /></Link>
            <Link className="btn-secondary" to="/login">Open Dashboard</Link>
          </div>
        </motion.div>
        <Card className="p-4">
          <div className="rounded-md bg-slate-950 p-5 text-white">
            <div className="mb-5 flex items-center justify-between">
              <span className="font-semibold">Prediction Snapshot</span>
              <BarChart3 className="text-cyan-300" />
            </div>
            {["Cement Ratio 1.000", "Water Ratio 0.514", "Coarse Agg. Ratio 3.000"].map((item, index) => (
              <div key={item} className="mb-3">
                <div className="mb-1 flex justify-between text-sm"><span>{item}</span><span>{84 - index * 11}%</span></div>
                <div className="h-2 rounded-full bg-white/10"><div className="h-2 rounded-full bg-cyan-400" style={{ width: `${84 - index * 11}%` }} /></div>
              </div>
            ))}
          </div>
        </Card>
      </section>
      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-10 md:grid-cols-3">
        {features.map((feature) => <Card key={feature.title}><feature.icon className="mb-4 text-cyan-600" /><h2 className="font-bold">{feature.title}</h2><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{feature.text}</p></Card>)}
      </section>
      <section className="mx-auto grid max-w-7xl gap-4 px-4 py-10 lg:grid-cols-3">
        <Card><h2 className="font-bold">About Model</h2><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Multi-output regression trained from concrete compressive strength observations to estimate seven mix ingredient ratios.</p></Card>
        <Card><h2 className="font-bold">Technology Stack</h2><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">FastAPI, MongoDB Motor, React, Vite, TypeScript, Tailwind, TanStack Query, Docker, and CI checks.</p></Card>
        <Card><h2 className="font-bold">Teams Love It</h2><p className="mt-2 text-sm text-slate-600 dark:text-slate-300">A clean workflow for lab teams, civil engineers, data scientists, and operations leaders.</p></Card>
      </section>
      <footer className="mx-auto max-w-7xl px-4 py-10 text-sm text-slate-500">ConcreteMix AI. Built for deployment on Render, Railway, VPS, and cloud VMs.</footer>
    </div>
  );
}
