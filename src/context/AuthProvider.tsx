import { useState, useEffect, useMemo } from "react";
import { AuthContext } from "./AuthContext"; // Importamos lo que creamos arriba
import { authService } from "@/services/authService";
import { clearAllFormDrafts } from "@/hooks/useFormDraft";
import type { User } from "@/types/types";
import type { REGISTER_FORM } from "@/types/formstypes";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = !!user && !!localStorage.getItem("auth_token");
  const clearError = () => setError(null);

  const login = async (credentials: { email: string; password: string }) => {
    try {
      setIsAuthenticating(true);
      setError(null);
      const response = await authService.login(credentials);
      if (response.success) {
        localStorage.setItem("auth_token", response.data.token);
        setUser(response.data.user);
        window.location.href = "/inicio";
      } else {
        throw new Error(response.message);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error en el login");
      throw err;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const register = async (userData: REGISTER_FORM) => {
    try {
      setIsAuthenticating(true);
      setError(null);
      const response = await authService.register(userData);
      if (response.success) {
        localStorage.setItem("auth_token", response.data.token);
        setUser(response.data.user);
        window.location.href = "/inicio";
      } else {
        throw new Error(response.message);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error en el registro");
      throw err;
    } finally {
      setIsAuthenticating(false);
    }
  };

  const logout = async () => {
    try {
      setIsAuthenticating(true);
      await authService.logout();
    } catch (err: unknown) {
      console.warn("Logout manual:", err);
    } finally {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("form_draft_login");
      localStorage.removeItem("form_draft_register");
      clearAllFormDrafts();
      setUser(null);
      setIsAuthenticating(false);
      window.location.href = "/login";
    }
  };

  const verifyUser = async () => {
    try {
      const token = localStorage.getItem("auth_token");
      if (!token) return;
      const response = await authService.verifyToken();
      if (response.success) setUser(response.data.user);
      else localStorage.removeItem("auth_token");
    } catch {
      localStorage.removeItem("auth_token");
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    verifyUser();
  }, []);

  useEffect(() => {
    const handleRouteChange = () => clearError();
    window.addEventListener("popstate", handleRouteChange);
    return () => window.removeEventListener("popstate", handleRouteChange);
  }, []);

  const value = useMemo(
    () => ({
      user,
      setUser,
      login,
      register,
      logout,
      verifyUser,
      isLoading,
      isAuthenticating,
      error,
      setError,
      clearError,
      isAuthenticated,
    }),
    [user, isLoading, isAuthenticating, error, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
