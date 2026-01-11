import { useMutation } from "@tanstack/react-query";
import { useAuthContext } from "@/context/AuthContext";
import type { LOGIN_FORM, REGISTER_FORM } from "@/types/formstypes";

// Hook para manejar el login con React Query
export const useLoginMutation = () => {
  const { login } = useAuthContext();

  return useMutation({
    mutationFn: async (credentials: LOGIN_FORM) => {
      // Usamos la función login de nuestro contexto
      await login(credentials);
    },
    onSuccess: () => console.log("🎉 Login listo"),
    onError: (error) => console.error("💥 Falló el login:", error),
  });
};

// Hook para el registro de nuevos usuarios
export const useRegisterMutation = () => {
  const { register } = useAuthContext();

  return useMutation({
    mutationFn: async (userData: REGISTER_FORM) => {
      await register(userData);
    },
    onSuccess: () => console.log("🎉 Registro completado"),
    onError: (error) => console.error("💥 Falló el registro:", error),
  });
};

// Hook para cerrar sesión
export const useLogoutMutation = () => {
  const { logout } = useAuthContext();

  return useMutation({
    mutationFn: async () => {
      await logout();
    },
    onSuccess: () => console.log("👋 Sesión cerrada"),
    onError: (error) => console.error("💥 Error al salir:", error),
  });
};

// Un hook para tener todas las mutaciones juntas
export const useAuthMutations = () => {
  return {
    loginMutation: useLoginMutation(),
    registerMutation: useRegisterMutation(),
    logoutMutation: useLogoutMutation(),
  };
};
