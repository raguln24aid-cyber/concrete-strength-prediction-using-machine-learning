import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Card } from "../components/ui/Card";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password, remember);
      navigate("/dashboard");
    } catch {
      setError("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative grid min-h-screen overflow-hidden place-items-center px-4 text-slate-950 bg-gradient-to-br from-cyan-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950 dark:text-slate-100">
      <div className="absolute top-1/4 -left-20 size-80 rounded-full bg-cyan-400/20 blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 size-80 rounded-full bg-blue-400/20 blur-3xl animate-pulse" />

      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <Card className="backdrop-blur-xl bg-white/60 dark:bg-slate-900/60 border-white/40 dark:border-white/10 shadow-2xl">
          <h1 className="text-2xl font-black bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-500">Login to continue to ConcreteMix AI.</p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <input className="input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <div className="relative">
              <input className="input pr-10" type={showPassword ? "text" : "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-slate-400 hover:text-cyan-600 transition-colors focus:outline-none" aria-label="Toggle password visibility">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2"><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} /> Remember me</label>
              <span className="text-cyan-700 dark:text-cyan-300">Forgot password?</span>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <button className="btn-primary w-full" disabled={loading}>{loading ? "Signing in..." : <>Login <LogIn size={16} /></>}</button>
          </form>
          <p className="mt-5 text-center text-sm">No account? <Link className="font-semibold text-cyan-700 dark:text-cyan-300" to="/register">Register</Link></p>
        </Card>
      </motion.div>
    </main>
  );
}
