import { createContext, useContext } from "react";
import type { User } from "@/types/types";
import type { REGISTER_FORM } from "@/types/formstypes";

export interface AuthContextProps {
  user: User | null;
  setUser: (user: User | null) => void;
  login: (credentials: { gmail: string; password: string }) => Promise<void>;
  register: (userData: REGISTER_FORM) => Promise<void>;
  logout: () => Promise<void>;
  verifyUser: () => Promise<void>;
  isLoading: boolean;
  isAuthenticating: boolean;
  error: string | null;
  setError: (error: string | null) => void;
  clearError: () => void;
  isAuthenticated: boolean;
}

export const AuthContext = createContext<AuthContextProps>(
  {} as AuthContextProps
);

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext debe usarse dentro de un AuthProvider");
  }
  return context;
};
