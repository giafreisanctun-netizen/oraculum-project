/**
 * Local Authentication Hook
 * Manages login/logout with local authentication
 */

import { useState, useEffect, useCallback } from "react";

export interface AuthUser {
  id: number;
  username: string;
  name: string | null;
  email: string | null;
  role: "user" | "admin";
  createdAt: string;
  updatedAt: string;
  lastSignedIn: string;
}

export interface UseLocalAuthReturn {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export function useLocalAuth(): UseLocalAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // =========================
  // CHECK AUTH SESSION
  // =========================
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/me", {
          credentials: "include",
        });

        const text = await response.text();

        try {
          const data = JSON.parse(text);
          if (data.user) {
            setUser(data.user);
          }
        } catch {
          // backend não retornou JSON válido
        }
      } catch (err) {
        console.error("[Auth] Check auth error:", err);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // =========================
  // LOGIN
  // =========================
  const login = useCallback(async (username: string, password: string) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      const text = await response.text();

      let data: any;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(text); // mostra erro real do backend
      }

      if (!response.ok) {
        throw new Error(data?.error || "Login failed");
      }

      setUser(data.user);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Login error";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // =========================
  // LOGOUT
  // =========================
  const logout = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      const text = await response.text();

      try {
        JSON.parse(text);
      } catch {
        // ignore
      }

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      setUser(null);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Logout error";

      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    logout,
  };
}
