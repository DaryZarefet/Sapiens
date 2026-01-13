import { AppProviders } from "./providers";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { AuthProvider } from "@/context/AuthProvider";
import { Toaster } from "sonner";

export const App = () => {
  return (
    <div>
      <AppProviders>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </AppProviders>
      <Toaster position="bottom-right" richColors />
    </div>
  );
};
