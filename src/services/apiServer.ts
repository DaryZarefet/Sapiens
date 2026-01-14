import axios from "axios";

export const apiServer = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
});

export const apiServerJWT = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    Authorization: `Bearer ${localStorage.getItem("auth_token") || ""}`,
  },
});

// // Interceptor de solicitudes para agregar el token
// apiServer.interceptors.request.use((config) => {
//   const token = localStorage.getItem("auth_token");

//   // No enviamos token en login/register
//   const isAuthPath =
//     config.url?.includes("/login/") ||
//     config.url?.includes("/register/") ||
//     config.url?.includes("/auth/");

//   if (token && !isAuthPath) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }

//   // Asegurarse de que el Content-Type sea correcto
//   if (!config.headers["Content-Type"]) {
//     config.headers["Content-Type"] = "application/json";
//   }

//   return config;
// });

// // Interceptor de respuestas para manejar errores 401
// apiServer.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // Token inválido o expirado
//       localStorage.removeItem("auth_token");
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );
