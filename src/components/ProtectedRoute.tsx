import { useAuthContext } from "@/context/AuthContext";
import { Navigate } from "react-router-dom";

// Componente para bloquear páginas si no estás logueado
export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuthContext();

  console.log(
    "[ProtectedRoute] Estado - isLoading:",
    isLoading,
    "isAuthenticated:",
    isAuthenticated
  );

  // Si la app todavía está viendo si hay un token guardado, mostramos un loading
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin text-4xl">⏳</div>
      </div>
    );
  }

  // Si no está logueado, lo mandamos directo al login
  if (!isAuthenticated) {
    console.warn(
      "[ProtectedRoute] Usuario no autenticado, redirigiendo a /login"
    );
    return <Navigate to="/login" replace />;
  }

  // Si todo está bien, lo dejamos pasar a la página
  return <>{children}</>;
};
