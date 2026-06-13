import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { Activity, History, Home, LogOut, Menu, Moon, Sun, User, WandSparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { cn } from "../../lib/utils";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: Home },
  { to: "/predict", label: "Predict", icon: WandSparkles },
  { to: "/history", label: "History", icon: History },
  { to: "/profile", label: "Profile", icon: User }
];

export function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dark, setDark] = useState(() => localStorage.getItem("theme") === "dark");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <div className="min-h-screen text-slate-950 dark:text-slate-100">
      <header className="sticky top-0 z-20 border-b border-white/40 bg-white/70 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link to="/dashboard" className="flex items-center gap-2 font-bold">
            <span className="grid size-9 place-items-center rounded-md bg-cyan-600 text-white"><Activity size={18} /></span>
            ConcreteMix AI
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((item) => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => cn("flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium", isActive ? "bg-cyan-600 text-white" : "hover:bg-white/70 dark:hover:bg-slate-800")}>
                <item.icon size={16} /> {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <button className="btn-secondary size-10 px-0 md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <button className="btn-secondary size-10 px-0" onClick={() => setDark((v) => !v)} aria-label="Toggle theme">
              {dark ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <button className="btn-secondary" onClick={() => { logout(); navigate("/login"); }}>
              <LogOut size={16} /> <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="border-t border-slate-200 dark:border-slate-800 bg-white/95 p-4 backdrop-blur-xl dark:bg-slate-950/95 md:hidden">
            <nav className="flex flex-col gap-1">
              {nav.map((item) => (
                <NavLink key={item.to} to={item.to} onClick={() => setIsMenuOpen(false)} className={({ isActive }) => cn("flex items-center gap-3 rounded-md px-3 py-3 text-sm font-medium", isActive ? "bg-cyan-600 text-white" : "hover:bg-slate-100 dark:hover:bg-slate-800")}>
                  <item.icon size={18} /> {item.label}
                </NavLink>
              ))}
            </nav>
          </div>
        )}
      </header>
      <main className="mx-auto max-w-7xl px-4 py-7">
        <div className="mb-6">
          <p className="text-sm text-slate-500 dark:text-slate-400">Signed in as {user?.name}</p>
        </div>
        <Outlet />
      </main>
    </div>
  );
}
