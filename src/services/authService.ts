import type { LOGIN_FORM, REGISTER_FORM } from "@/types/formstypes";
import type { User } from "@/types/types";

// Usuarios de prueba para que la app funcione mientras no hay backend
const mockUsers = [
  {
    id: 1,
    name: "Dario Martinez",
    email: "dario@gmail.com",
    username: "dario_m",
    avatar: "/src/assets/images/048617ceb68b40a45847078db347ba59.png",
    theme: "light",
  },
  {
    id: 2,
    name: "Ana García",
    email: "ana@gmail.com",
    username: "ana_g",
    avatar: "/src/assets/images/048617ceb68b40a45847078db347ba59.png",
    theme: "light",
  },
];

// Para que se vea el spinner de carga
const simulateNetworkDelay = (ms = 800) =>
  new Promise((res) => setTimeout(res, ms));

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
  token?: string;
}

export const authService = {
  // Lógica de login simulada
  async login(
    credentials: LOGIN_FORM
  ): Promise<ApiResponse<{ user: User; token: string }>> {
    await simulateNetworkDelay();

    const user = mockUsers.find((u) => u.email === credentials.email);
    if (!user) throw new Error("El usuario no está registrado");

    // Contraseña de prueba fija
    if (credentials.password !== "123456")
      throw new Error("La contraseña es incorrecta");

    return {
      success: true,
      data: { user: user as User, token: "token_falso_123" },
      message: "Entraste correctamente",
    };
  },

  // Crear cuenta nueva simulado
  async register(
    userData: REGISTER_FORM
  ): Promise<ApiResponse<{ user: User; token: string }>> {
    await simulateNetworkDelay();

    if (mockUsers.find((u) => u.email === userData.email)) {
      throw new Error("El email ya está registrado");
    }

    const newUser: User = {
      id: Date.now(),
      name: userData.username,
      username: userData.username,
      email: userData.email,
      avatar: "/src/assets/images/048617ceb68b40a45847078db347ba59.png",
      theme: "light",
    };

    return {
      success: true,
      data: { user: newUser, token: "token_falso_456" },
      message: "Cuenta creada",
    };
  },

  // Cerrar sesión
  async logout(): Promise<ApiResponse<null>> {
    await simulateNetworkDelay(300);
    return { success: true, data: null, message: "Chao!" };
  },

  // Verificar si el token guardado todavía sirve
  async verifyToken(): Promise<ApiResponse<{ user: User }>> {
    await simulateNetworkDelay(400);
    // Siempre devolvemos el primero para las pruebas
    return {
      success: true,
      data: { user: mockUsers[0] as User },
      message: "OK",
    };
  },
};
