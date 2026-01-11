import { useEffect } from "react";

import { TextInput } from "@/shared/inputs/TextInput.tsx";
import { PasswordInput } from "@/shared/inputs/PasswordInput.tsx";
import { ButtonAction } from "@/shared/ui/ButtonAction";
import { Buttonav } from "@/shared/ui/Buttonnav";
import { AuthWrapper } from "./AuthWrapper";

import { useAuthContext } from "@/context/AuthContext";
import { useFormDraft, clearFormDraft } from "@/hooks/useFormDraft";

import { FaUserCircle } from "react-icons/fa";
import { BsGoogle } from "react-icons/bs";

import type { LOGIN_FORM } from "@/types/formstypes";

const Login = () => {
  const {
    control,
    handleSubmit,
    formState: { isValid },
    setError,
    reset,
  } = useFormDraft<LOGIN_FORM>("login", {
    email: "",
    password: "",
  });

  const { login, isAuthenticating, error, clearError } = useAuthContext();

  // Limpiar errores al montar y desmontar
  useEffect(() => {
    clearError();
  }, [clearError]);

  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  // Manejo del envío del formulario
  const onSubmit = async (data: LOGIN_FORM) => {
    if (!isValid) return;
    try {
      await login(data);
      clearFormDraft("login");
      reset();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";
      if (errorMessage.includes("El usuario no está registrado")) {
        setError("email", { message: "El usuario no está registrado" });
      } else if (errorMessage.includes("La contraseña es incorrecta")) {
        setError("password", { message: "La contraseña es incorrecta" });
      } else {
        setError("email", { message: errorMessage });
      }
    }
  };

  const getErrorMessage = () => {
    if (!error) return null;
    if (error.includes("Credenciales inválidas"))
      return "Email o contraseña incorrectos";
    return error;
  };

  return (
    <AuthWrapper>
      <div className="flex flex-col gap-4 items-center justify-center w-full min-h-screen p-6 bg-surface text-primary">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center justify-center gap-8 py-6 px-6 sm:px-8 rounded-4xl bg-surface-2 border-default shadow-md w-full max-w-md"
          noValidate
        >
          {/* Icono con el color original */}
          <FaUserCircle
            size={90}
            className="fill-blue-950"
            aria-hidden="true"
          />

          <section className="flex flex-col gap-6 w-full">
            <TextInput
              label="Email"
              name="email"
              control={control}
              type="email"
              placeholder="tu@email.com"
              className="input-underline focus-ring-primary"
              rules={{
                required: "El email es requerido",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Email inválido",
                },
              }}
            />

            <PasswordInput
              label="Contraseña"
              name="password"
              control={control}
              placeholder="Tu contraseña"
              className="input-underline focus-ring-primary"
              rules={{
                required: "La contraseña es requerida",
                minLength: { value: 6, message: "Mínimo 6 caracteres" },
              }}
            />
          </section>

          {getErrorMessage() && (
            <div
              className="w-full p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm"
              role="alert"
            >
              {getErrorMessage()}
            </div>
          )}

          <div className="flex flex-col items-center text-md gap-3 w-full">
            <div className="w-full flex justify-between text-sm">
              <Buttonav
                path="/register"
                className="text-primary hover:underline hover:text-primary-600 visited:text-muted"
              >
                ¿No tienes cuenta?
              </Buttonav>
              <Buttonav
                path="/recuperar"
                className="text-primary hover:underline hover:text-primary-600 visited:text-muted"
              >
                ¿Olvidaste tu contraseña?
              </Buttonav>
            </div>
          </div>

          <div className="w-full">
            <ButtonAction
              type="submit"
              color="primary"
              disabled={!isValid || isAuthenticating}
              className={`w-full btn-primary ${
                !isValid || isAuthenticating
                  ? "opacity-50 pointer-events-none"
                  : ""
              }`}
            >
              {isAuthenticating ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Iniciando sesión...
                </span>
              ) : (
                "Iniciar sesión"
              )}
            </ButtonAction>
          </div>
        </form>

        {/* Botón de Google fuera del form, como estaba antes */}
        <ButtonAction
          type="button"
          color="primary"
          className="btn-primary flex items-center gap-5 opacity-50 cursor-not-allowed"
        >
          <BsGoogle size={24} />
          Iniciar sesión con Google
        </ButtonAction>
      </div>
    </AuthWrapper>
  );
};

export default Login;
