import { createContext, useContext, useMemo, useState } from "react";
import { api } from "../lib/api";
import type { AuthResponse, User } from "../types/api";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string, remember: boolean) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function persistAuth(data: AuthResponse, remember = true) {
  const store = remember ? localStorage : sessionStorage;
  store.setItem("access_token", data.access_token);
  store.setItem("refresh_token", data.refresh_token);
  store.setItem("user", JSON.stringify(data.user));
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const cached = localStorage.getItem("user") || sessionStorage.getItem("user");
    return cached ? JSON.parse(cached) : null;
  });
  const [loading] = useState(false);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    async login(email, password, remember) {
      const { data } = await api.post<AuthResponse>("/api/auth/login", { email, password });
      localStorage.clear();
      sessionStorage.clear();
      persistAuth(data, remember);
      setUser(data.user);
    },
    async register(name, email, password) {
      const { data } = await api.post<AuthResponse>("/api/auth/register", { name, email, password });
      persistAuth(data, true);
      setUser(data.user);
    },
    logout() {
      localStorage.clear();
      sessionStorage.clear();
      setUser(null);
    }
  }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used inside AuthProvider");
  return context;
}
