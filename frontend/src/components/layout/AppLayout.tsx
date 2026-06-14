import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { Activity, History, Home, LogOut, Menu, MessageSquare, Moon, Sun, User, WandSparkles, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { cn } from "../../lib/utils";

const nav = [
  { to: "/dashboard", label: "Dashboard", icon: Home },
  { to: "/predict", label: "Predict", icon: WandSparkles },
  { to: "/history", label: "History", icon: History },
  { to: "/profile", label: "Profile", icon: User }
];

function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex size-14 items-center justify-center rounded-full bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 text-white shadow-xl shadow-indigo-500/30 transition-all hover:scale-110 active:scale-95"
      >
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
      </button>
      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 overflow-hidden rounded-2xl border border-slate-200 bg-white/90 shadow-2xl backdrop-blur-xl dark:border-slate-800 dark:bg-slate-900/90 animate-in fade-in slide-in-from-bottom-5">
           <div className="bg-gradient-to-r from-cyan-600 to-indigo-600 p-4 text-white">
             <h3 className="font-bold">MixAI Assistant</h3>
             <p className="text-[10px] opacity-80 uppercase tracking-widest">Engineering Support</p>
           </div>
           <div className="flex h-64 flex-col items-center justify-center p-6 text-center text-slate-500">
             <div className="mb-3 rounded-full bg-slate-100 p-3 dark:bg-slate-800"><WandSparkles className="text-indigo-500" /></div>
             <p className="text-xs">Chatbot integration is coming soon! Ask me about concrete mix proportions or strength targets.</p>
           </div>
           <div className="border-t border-slate-200 p-3 dark:border-slate-800">
             <input disabled className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none dark:border-slate-700 dark:bg-slate-800" placeholder="Type a message..." />
           </div>
        </div>
      )}
    </div>
  );
}

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
    <div className="relative min-h-screen bg-slate-50/30 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      {/* Subtle Background Accents */}
      <div className="absolute -left-40 top-0 size-[500px] rounded-full bg-cyan-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute -right-40 bottom-0 size-[500px] rounded-full bg-blue-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-[800px] rounded-full bg-indigo-500/5 blur-[160px] pointer-events-none" />

      <header className="sticky top-0 z-20 border-b-2 border-transparent bg-white/60 backdrop-blur-xl dark:bg-slate-950/60 [border-image:linear-gradient(to_right,transparent,#0891b2,transparent)1]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <Link to="/dashboard" className="flex items-center gap-2 font-bold">
            <span className="grid size-9 place-items-center rounded-md bg-gradient-to-br from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20"><Activity size={18} /></span>
            <span className="bg-gradient-to-r from-cyan-600 to-blue-600 bg-clip-text text-transparent">ConcreteMix AI</span>
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
      <ChatWidget />
    </div>
  );
}
