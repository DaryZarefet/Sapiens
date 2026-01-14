import { apiServer } from "@/services/apiServer";
import type { ApiResponse } from "./authService";
import type { User } from "@/types/types";

export interface UpdateProfileParams {
  name?: string;
  alias?: string;
  username?: string;
  birth_date?: string;
  sex?: string; // "masculino" | "femenino"
  about?: string;
  avatar?: File;
}

export const userService = {
  async updateProfile(
    params: UpdateProfileParams
  ): Promise<ApiResponse<{ user: User }>> {
    try {
      const formData = new FormData();

      if (params.name) formData.append("name", params.name); // 'name' might not be used if 'Nombre_de_Usuario' is the main one, but keeping for safety
      if (params.alias) formData.append("Alias", params.alias);

      // Backend espera Nombre_de_Usuario
      if (params.username) {
        formData.append("Nombre_de_Usuario", params.username);
      }

      if (params.birth_date)
        formData.append("Fecha_nacimiento", params.birth_date);
      if (params.sex) formData.append("Sexo", params.sex);
      if (params.about) formData.append("Nota", params.about);

      if (params.avatar) {
        formData.append("Avatar", params.avatar);
      }

      console.log("[UserService] Updating profile...", params);

      // El interceptor de apiServer añade el token automáticamente
      // Usamos 'put' o 'patch' según tu backend. Usaré 'put' como default.
      const response = await apiServer.put("/api/profile/", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("[UserService] Update response:", response.data);

      return {
        success: true,
        data: response.data,
        message: "Perfil actualizado correctamente",
      };
    } catch (error: unknown) {
      console.error("[UserService] Error updating profile:", error);
      throw error;
    }
  },
};
