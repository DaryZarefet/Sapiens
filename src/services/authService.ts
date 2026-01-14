import { apiServer } from "@/services/apiServer";
import type { LOGIN_FORM, REGISTER_FORM } from "@/types/formstypes";
import type { User } from "@/types/types";
import axios from "axios";

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

export const authService = {
  async login(
    credentials: LOGIN_FORM
  ): Promise<ApiResponse<{ user: User; token: string }>> {
    try {
      // Enviar credenciales tal como espera el backend Django
      const payload = {
        gmail: credentials.gmail,
        password: credentials.password,
      };

      console.log("[AuthService] Iniciando login...", {
        gmail: payload.gmail,
        passwordLength: payload.password.length,
      });

      const response = await apiServer.post("/api/login/", payload);
      console.log("[AuthService] Respuesta cruda del login:", response.data);

      // Extraer token de múltiples formas posibles según el backend
      const token =
        response.data.token_acceso ||
        response.data.access ||
        response.data.token ||
        response.data.key ||
        response.data.auth_token;

      if (!token) {
        console.error(
          "[AuthService] No se encontró token en la respuesta:",
          response.data
        );
        throw new Error("No se recibió token del servidor");
      }

      // Guardar token en localStorage solo UNA VEZ
      localStorage.setItem("auth_token", token);
      console.log("[AuthService] Token guardado en localStorage");

      // Preparar la respuesta con el user
      const responseData = {
        user: response.data.user || {
          id: "",
          name: "",
          email: credentials.gmail,
        },
        token: token,
      };

      return { success: true, data: responseData, message: "OK" };
    } catch (error: unknown) {
      console.error("[AuthService] Error en login:", error);
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.detail ||
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.response?.statusText ||
          "Credenciales incorrectas";
        throw new Error(String(errorMessage));
      }
      throw new Error("Error de conexión con el servidor");
    }
  },

  async register(
    userData: REGISTER_FORM
  ): Promise<ApiResponse<{ message: string }>> {
    try {
      const payload = {
        username: userData.Nombre_de_Usuario,
        Nombre_de_Usuario: userData.Nombre_de_Usuario,
        gmail: userData.gmail,
        password: userData.password,
        confirm_password: userData.confirm_password,
      };

      console.log("[AuthService] Iniciando registro...", {
        username: payload.username,
        Nombre_de_Usuario: payload.Nombre_de_Usuario,
        gmail: payload.gmail,
      });

      const response = await apiServer.post("/api/register/student/", payload);

      console.log("[AuthService] Respuesta del registro (201):", response.data);

      // El backend devuelve 201 Created sin token, solo confirma el registro
      return {
        success: true,
        data: {
          message: response.data.message || "Usuario registrado exitosamente",
        },
        message: "OK",
      };
    } catch (error: unknown) {
      console.error("[AuthService] Error en registro:", error);
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.detail ||
          error.response?.data?.message ||
          error.response?.data?.error ||
          error.response?.statusText ||
          "Error al registrarse";
        throw new Error(String(errorMessage));
      }
      throw new Error("Error de conexión con el servidor");
    }
  },

  async logout(): Promise<void> {
    try {
      // Opcional: informar al backend sobre el logout
      await apiServer.post("/api/logout/");
    } catch (error) {
      console.warn("[AuthService] Error al hacer logout en backend:", error);
    } finally {
      localStorage.removeItem("auth_token");
    }
  },

  async verifyToken(): Promise<ApiResponse<{ user: User }>> {
    const token = localStorage.getItem("auth_token");
    // Si no hay token, no disparamos la petición para evitar el error 401
    if (!token) {
      console.log("[AuthService] No hay token en localStorage");
      throw new Error("No hay sesión");
    }

    try {
      console.log("[AuthService] Verificando token con /api/profile/");
      const response = await apiServer.get("/api/profile/");
      console.log("[AuthService] Token válido, usuario verificado");
      return { success: true, data: response.data, message: "OK" };
    } catch (error: unknown) {
      console.error("[AuthService] Error verificando token:", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        console.warn("[AuthService] Token inválido (401), eliminando...");
        localStorage.removeItem("auth_token");
      }
      throw new Error("Token inválido o expirado");
    }
  },
};
