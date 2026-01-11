import { Loader2 } from "lucide-react";

// Pantalla de carga simple que sale mientras verificamos si el usuario tiene sesión activa
export const AuthLoading = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen p-6 bg-surface text-primary">
      <div className="flex flex-col items-center gap-4">
        <Loader2 size={48} className="animate-spin text-blue-600" />
        <p className="text-lg font-medium">Verificando sesión...</p>
      </div>
    </div>
  );
};
