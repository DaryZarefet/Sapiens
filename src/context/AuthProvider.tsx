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

  const login = async (credentials: { gmail: string; password: string }) => {
    try {
      setIsAuthenticating(true);
      setError(null);
      const response = await authService.login(credentials);
      if (response.success) {
        // Guardar el token que viene en la respuesta
        localStorage.setItem("auth_token", response.data.token);
        // Establecer el usuario
        setUser(response.data.user);
        console.log("[AuthProvider] Login exitoso, usuario establecido");
      } else {
        throw new Error(response.message);
      }
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : "Error en el login";
      console.error("[AuthProvider] Error:", errorMsg);
      setError(errorMsg);
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
        // El registro fue exitoso (201 Created)
        // No se guardan credenciales, solo se redirige a login
        clearAllFormDrafts();
        window.location.href = "/login";
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
      console.log("[AuthProvider] Verificando usuario, token existe:", !!token);

      if (!token) {
        console.log("[AuthProvider] No hay token, usuario no autenticado");
        setIsLoading(false);
        return;
      }

      const response = await authService.verifyToken();
      if (response.success) {
        console.log("[AuthProvider] Usuario verificado:", response.data.user);
        setUser(response.data.user);
      } else {
        console.warn("[AuthProvider] Verificación fallida");
        localStorage.removeItem("auth_token");
        setUser(null);
      }
    } catch (error) {
      console.warn("[AuthProvider] Error verificando usuario:", error);
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
