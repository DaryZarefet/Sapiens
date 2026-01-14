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

      // Enviamos siempre los campos, incluso si están vacíos, para permitir borrarlos
      if (params.name !== undefined) formData.append("name", params.name);

      // Alias: enviamos incluso si está vacío para permitir borrarlo
      if (params.alias !== undefined) {
        formData.append("Alias", params.alias);
      }

      // Backend espera Nombre_de_Usuario
      if (params.username !== undefined) {
        formData.append("Nombre_de_Usuario", params.username);
      }

      if (params.birth_date !== undefined)
        formData.append("Fecha_nacimiento", params.birth_date);
      if (params.sex !== undefined) formData.append("Sexo", params.sex);
      if (params.about !== undefined) formData.append("Nota", params.about);

      // Avatar: solo si hay un archivo nuevo
      if (params.avatar instanceof File) {
        formData.append("Avatar", params.avatar, params.avatar.name);
      }

      console.log("[UserService] Updating profile...", params);

      // Log FormData contents for debugging
      console.log("[UserService] FormData contents:");
      formData.forEach((value, key) => {
        if (value instanceof File) {
          console.log(
            `  ${key}:`,
            `File(${value.name}, ${value.type}, ${value.size} bytes)`
          );
        } else {
          console.log(`  ${key}:`, value);
        }
      });

      // El interceptor de apiServer añade el token automáticamente
      // NO establecemos Content-Type manualmente para FormData
      // El navegador lo establece automáticamente con el boundary correcto
      const response = await apiServer.put("/api/profile/", formData);

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
