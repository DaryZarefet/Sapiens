import { useEffect } from "react";
import { useAuthContext } from "@/context/AuthContext";

// Este componente lo usamos para envolver el login/register y limpiar errores viejos al cambiar de pestaña
export const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const { clearError } = useAuthContext();

  useEffect(() => {
    // Si venimos de otra página, borramos cualquier error que se haya quedado guardado
    clearError();
  }, [clearError]);

  return <>{children}</>;
};
