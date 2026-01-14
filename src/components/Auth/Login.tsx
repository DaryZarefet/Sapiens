import { useEffect, useState } from "react";
import { TextInput } from "@/shared/inputs/TextInput.tsx";
import { PasswordInput } from "@/shared/inputs/PasswordInput.tsx";
import { ButtonAction } from "@/shared/ui/ButtonAction";
import { Buttonav } from "@/shared/ui/Buttonnav";
import { AuthWrapper } from "./AuthWrapper";

import { useAuthContext } from "@/context/AuthContext";
import { useFormDraft } from "@/hooks/useFormDraft";
// clearFormDraft

import { FaUserCircle } from "react-icons/fa";
import { BsGoogle } from "react-icons/bs";

import type { LOGIN_FORM } from "@/types/formstypes";

const Login = () => {
  const [isLoading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { isValid },
    // setError,
    reset,
  } = useFormDraft<LOGIN_FORM>("login", {
    gmail: "",
    password: "",
  });

  const {
    login,
    isAuthenticating,
    error: apiError,
    clearError,
  } = useAuthContext();

  useEffect(() => {
    clearError();
    return () => clearError();
  }, [clearError]);

  const onSubmit = async (data: LOGIN_FORM) => {
    setLoading(true);
    const payload = {
      gmail: data.gmail,
      password: data.password,
    };

    try {
      const response = await login(payload);
      console.log(response);

      // clearFormDraft("login");
      reset();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthWrapper>
      <div className="flex flex-col gap-4 items-center justify-center w-full min-h-screen p-6 bg-surface text-primary">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center justify-center gap-8 py-8 px-6 sm:px-10 rounded-4xl bg-surface-2 border-default shadow-md w-full max-w-md"
          noValidate
        >
          <FaUserCircle
            size={90}
            className="fill-blue-950"
            aria-hidden="true"
          />

          <section className="flex flex-col gap-6 w-full">
            <TextInput
              label="Email"
              name="gmail" // Cambiado a 'gmail'
              control={control}
              type="email"
              placeholder="tu@email.com"
              className="input-underline focus-ring-primary"
              rules={{
                required: "El email es obligatorio",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
                  message: "Email no válido",
                },
              }}
            />

            <PasswordInput
              label="Contraseña"
              name="password"
              control={control}
              placeholder="Introduce tu contraseña"
              className="input-underline focus-ring-primary"
              rules={{
                required: "La contraseña es obligatoria",
                // Mantenemos las reglas de validación front igual que en el Register
                minLength: { value: 8, message: "Mínimo 8 caracteres" },
              }}
            />
          </section>

          {apiError && (
            <div className="w-full p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm animate-in fade-in duration-300">
              {apiError}
            </div>
          )}

          <div className="w-full flex justify-center px-1">
            <Buttonav
              path="/register"
              className="text-sm text-primary hover:underline font-medium"
            >
              ¿No tienes cuenta? Regístrate
            </Buttonav>
          </div>

          <div className="w-full flex flex-col gap-4">
            <ButtonAction
              type="submit"
              color="primary"
              disabled={isLoading}
              className={`w-full py-3 btn-primary transition-all duration-300 ${
                !isValid || isAuthenticating
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:shadow-lg active:scale-[0.99] brightness-110"
              }`}
            >
              {isAuthenticating ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin text-lg">⏳</span>
                  Cargando...
                </span>
              ) : (
                "Iniciar sesión"
              )}
            </ButtonAction>

            <div className="relative flex items-center justify-center w-full my-1">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink mx-4 text-gray-400 text-[10px] uppercase tracking-widest font-bold">
                O
              </span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <ButtonAction
              type="button"
              color="primary"
              onClick={() => console.log("Google Login Clicked")}
              className="w-full py-3 btn-primary flex items-center justify-center gap-4 hover:shadow-lg active:scale-[0.99] transition-all duration-300 brightness-110 shadow-md"
            >
              <BsGoogle size={20} className="text-white" />
              <span className="font-bold">Iniciar sesión con Google</span>
            </ButtonAction>
          </div>
        </form>
      </div>
    </AuthWrapper>
  );
};

export default Login;
