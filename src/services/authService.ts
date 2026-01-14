import { apiServer, apiServerJWT } from "@/services/apiServer";
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
      console.log(
        "[AuthService] Respuesta cruda del login:",
        response.data.token_acceso
      );

      localStorage.setItem("auth_token", response.data.token_acceso);

      console.log("[AuthService] Respuesta del login:", response.data);

      // Extraer token de múltiples formas posibles según el backend
      const token =
        response.data.access ||
        response.data.token ||
        response.data.key ||
        response.data.auth_token;

      if (!token) {
        throw new Error("No se recibió token del servidor");
      }

      // Guardar token en localStorage
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
  ): Promise<ApiResponse<{ user: User; token: string }>> {
    try {
      const payload = {
        Nombre_de_Usuario: userData.Nombre_de_Usuario,
        gmail: userData.gmail,
        password: userData.password,
        confirm_password: userData.confirm_password,
      };

      console.log("[AuthService] Iniciando registro...", {
        Nombre_de_Usuario: payload.Nombre_de_Usuario,
        gmail: payload.gmail,
      });

      const response = await apiServer.post("/api/register/", payload);

      console.log("[AuthService] Respuesta del registro:", response.data);

      const token =
        response.data.access ||
        response.data.token ||
        response.data.key ||
        response.data.auth_token;

      if (!token) {
        throw new Error("No se recibió token del servidor");
      }

      localStorage.setItem("auth_token", token);
      console.log("[AuthService] Token guardado en localStorage");

      const responseData = {
        user: response.data.user || {
          id: "",
          name: userData.Nombre_de_Usuario,
          email: userData.gmail,
        },
        token: token,
      };

      return { success: true, data: responseData, message: "OK" };
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
    if (!token) throw new Error("No hay sesión");

    try {
      const response = await apiServerJWT.get("/api/profile/");
      return { success: true, data: response.data, message: "OK" };
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        localStorage.removeItem("auth_token");
      }
      throw new Error("Token inválido");
    }
  },
};
