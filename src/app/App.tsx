import { AppProviders } from "./providers";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { AuthProvider } from "@/context/AuthContext";

export const App = () => {
  return (
    <AppProviders>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </AppProviders>
  );
};
