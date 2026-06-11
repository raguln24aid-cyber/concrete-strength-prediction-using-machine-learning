import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Eye, LogIn } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { Card } from "../components/ui/Card";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
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
    <main className="grid min-h-screen place-items-center px-4 text-slate-950 dark:text-slate-100">
      <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <Card>
          <h1 className="text-2xl font-black">Welcome back</h1>
          <p className="mt-1 text-sm text-slate-500">Login to continue to ConcreteMix AI.</p>
          <form onSubmit={submit} className="mt-6 space-y-4">
            <input className="input" type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <div className="relative">
              <input className="input pr-10" type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8} required />
              <Eye className="absolute right-3 top-3 text-slate-400" size={16} />
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

