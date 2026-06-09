import { createContext, useContext, useEffect, useState } from "react";

const BASE_URL = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

const KEYS = {
  token: "session_token",
  refresh: "session_refresh_token",
  expiresAt: "session_expires_at",
} as const;

interface AuthUser {
  userId: number;
  regno: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: true,
  login: () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function getSessionToken(): string | null {
  return localStorage.getItem(KEYS.token);
}

function storeSession(token: string, refreshToken: string, expiresIn: number) {
  localStorage.setItem(KEYS.token, token);
  localStorage.setItem(KEYS.refresh, refreshToken);
  localStorage.setItem(KEYS.expiresAt, String(Date.now() + expiresIn * 1000));
}

function clearSession() {
  localStorage.removeItem(KEYS.token);
  localStorage.removeItem(KEYS.refresh);
  localStorage.removeItem(KEYS.expiresAt);
}

function consumeUrlParams(): {
  token?: string;
  refresh?: string;
  expiresIn?: number;
  authError?: string;
} {
  const params = new URLSearchParams(window.location.search);
  const result = {
    token: params.get("token") ?? undefined,
    refresh: params.get("refresh") ?? undefined,
    expiresIn: params.get("expires_in")
      ? Number(params.get("expires_in"))
      : undefined,
    authError: params.get("auth_error") ?? undefined,
  };
  ["token", "refresh", "expires_in", "auth_error"].forEach((k) =>
    params.delete(k),
  );
  const qs = params.toString();
  window.history.replaceState({}, "", qs ? `?${qs}` : window.location.pathname);
  return result;
}

let pendingRefresh: Promise<string | null> | null = null;

async function getActiveToken(): Promise<string | null> {
  const token = localStorage.getItem(KEYS.token);
  if (!token) return null;

  const expiresAt = Number(localStorage.getItem(KEYS.expiresAt));
  if (expiresAt && expiresAt > Date.now()) return token;

  // Deduplicate concurrent refresh calls (e.g. StrictMode double-mount, two tabs)
  if (pendingRefresh) return pendingRefresh;

  pendingRefresh = (async () => {
    const refreshToken = localStorage.getItem(KEYS.refresh);
    if (!refreshToken) { clearSession(); return null; }

    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    if (!res.ok) { clearSession(); return null; }

    const data = (await res.json()) as { token: string; expires_in: number };
    localStorage.setItem(KEYS.token, data.token);
    localStorage.setItem(KEYS.expiresAt, String(Date.now() + data.expires_in * 1000));
    return data.token;
  })().finally(() => { pendingRefresh = null; });

  return pendingRefresh;
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { token, refresh, expiresIn, authError } = consumeUrlParams();

    if (authError) {
      console.error("[auth] SSO error:", authError);
      setLoading(false);
      return;
    }

    if (token && refresh && expiresIn) {
      storeSession(token, refresh, expiresIn);
    }

    getActiveToken()
      .then((activeToken) => {
        if (!activeToken) return null;
        return fetch(`${BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${activeToken}` },
        }).then((res) => {
          if (!res.ok) {
            clearSession();
            return null;
          }
          return res.json() as Promise<AuthUser>;
        });
      })
      .then((data) => {
        if (data) setUser(data);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = () => {
    window.location.href = `${BASE_URL}/auth/login`;
  };

  const logout = async () => {
    const token = localStorage.getItem(KEYS.token);
    if (token) {
      await fetch(`${BASE_URL}/auth/logout`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => {});
    }
    clearSession();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
