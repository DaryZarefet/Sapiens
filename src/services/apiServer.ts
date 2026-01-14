import axios from "axios";

export const apiServer = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

// Interceptor de solicitudes para agregar el token
apiServer.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth_token");

  // No enviamos token en login/register
  const isAuthPath =
    config.url?.includes("/login/") ||
    config.url?.includes("/register/") ||
    config.url?.includes("/auth/");

  if (token && !isAuthPath) {
    config.headers.Authorization = `Bearer ${token}`;
    console.log("[APIServer] Agregando token al header para:", config.url);
  }

  // Asegurarse de que el Content-Type sea correcto
  // No establecer Content-Type para FormData (el navegador lo hace automáticamente)
  if (!config.headers["Content-Type"] && !(config.data instanceof FormData)) {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});

// Interceptor de respuestas para manejar errores 401
apiServer.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const endpoint = error.config?.url || "unknown";
      console.warn("[APIServer] Error 401 en:", endpoint);
      console.warn("[APIServer] Detalles:", error.response?.data);

      // Solo redirigir a login si es un error de autenticación real
      // No por otros errores del backend que devuelvan 401
      const isAuthenticationError =
        error.response?.data?.detail?.toLowerCase().includes("autenticación") ||
        error.response?.data?.detail?.toLowerCase().includes("token") ||
        error.response?.data?.detail?.toLowerCase().includes("credenciales") ||
        error.response?.data?.message
          ?.toLowerCase()
          .includes("autenticación") ||
        error.response?.data?.message?.toLowerCase().includes("token") ||
        error.config?.url?.includes("/profile/"); // Si falla /profile/, probablemente el token es inválido

      if (isAuthenticationError) {
        console.warn(
          "[APIServer] Token inválido o expirado - Redirigiendo a login"
        );
        localStorage.removeItem("auth_token");

        // Solo redirigir si no estamos ya en login
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }
      } else {
        console.warn(
          "[APIServer] Error 401 pero no parece ser de autenticación - No redirigiendo"
        );
      }
    }
    return Promise.reject(error);
  }
);
