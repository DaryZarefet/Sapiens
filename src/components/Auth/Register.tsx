import { useEffect } from "react";

import { TextInput } from "@/shared/inputs/TextInput.tsx";
import { PasswordInput } from "@/shared/inputs/PasswordInput.tsx";
import { ButtonAction } from "@/shared/ui/ButtonAction";
import { Buttonav } from "@/shared/ui/Buttonnav";
import { AuthWrapper } from "./AuthWrapper";

import { useAuthContext } from "@/context/AuthContext";
import { useFormDraft, clearFormDraft } from "@/hooks/useFormDraft";

import { BsGoogle } from "react-icons/bs";
import { FaUserCircle } from "react-icons/fa";

import type { REGISTER_FORM } from "@/types/formstypes";

const Register = () => {
  const {
    control,
    handleSubmit,
    watch,
    formState: { isValid },
    setError,
    reset,
  } = useFormDraft<REGISTER_FORM>("register", {
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const { register, isAuthenticating, error, clearError } = useAuthContext();

  // Limpiar errores al montar y desmontar
  useEffect(() => {
    clearError();
  }, [clearError]);

  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  const password = watch("password");

  // Manejo del envío del formulario
  const onSubmit = async (data: REGISTER_FORM) => {
    if (!isValid) return;

    try {
      await register(data);
      clearFormDraft("register");
      reset();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";

      if (errorMessage.includes("email ya está registrado")) {
        setError("email", { message: "Este email ya está registrado" });
      } else if (errorMessage.includes("contraseñas no coinciden")) {
        setError("password", { message: "Las contraseñas no coinciden" });
        setError("confirm_password", {
          message: "Las contraseñas no coinciden",
        });
      } else {
        setError("username", { message: errorMessage });
      }

      console.error("Error en registro:", err);
    }
  };

  const getErrorMessage = () => {
    if (!error) return null;
    if (error.includes("email ya está registrado"))
      return "Este email ya está en uso.";
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
          <FaUserCircle
            size={90}
            className="fill-blue-950"
            aria-hidden="true"
          />

          <section className="flex flex-col gap-6 w-full">
            <TextInput
              label="Nombre de usuario"
              name="username"
              control={control}
              type="text"
              placeholder="tu_usuario"
              className="input-underline focus-ring-primary"
              rules={{
                required: "El nombre de usuario es requerido",
                minLength: { value: 3, message: "Mínimo 3 caracteres" },
              }}
            />

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

            <PasswordInput
              label="Confirmar contraseña"
              name="confirm_password"
              control={control}
              placeholder="Repite tu contraseña"
              className="input-underline focus-ring-primary"
              rules={{
                required: "Confirma tu contraseña",
                validate: (value: string) =>
                  value === password || "Las contraseñas no coinciden",
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

          <div className="flex gap-16">
            <Buttonav
              path="/login"
              className="text-sm text-primary hover:underline hover:text-primary-600 visited:text-muted"
            >
              ¿Ya tienes cuenta?
            </Buttonav>
          </div>

          <div className="w-full">
            <ButtonAction
              type="submit"
              color="primary"
              className={`w-full btn-primary ${
                isAuthenticating || !isValid
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              {isAuthenticating ? (
                <span className="flex items-center gap-2">
                  <span className="animate-spin">⏳</span>
                  Creando cuenta...
                </span>
              ) : (
                "Crear cuenta"
              )}
            </ButtonAction>
          </div>
        </form>

        <ButtonAction
          type="button"
          color="primary"
          className="btn-primary flex items-center gap-5 opacity-50 cursor-not-allowed"
        >
          <BsGoogle size={24} />
          Crear cuenta con Google
        </ButtonAction>
      </div>
    </AuthWrapper>
  );
};

export default Register;
