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

  const {
    register,
    isAuthenticating,
    error: apiError,
    clearError,
  } = useAuthContext();

  useEffect(() => {
    clearError();
    return () => clearError();
  }, [clearError]);

  const password = watch("password");

  const onSubmit = async (data: REGISTER_FORM) => {
    if (!isValid) return;

    const sanitizedData = {
      ...data,
      username: data.username.trim(),
      email: data.email.trim().toLowerCase(),
    };

    try {
      await register(sanitizedData);
      clearFormDraft("register");
      reset();
    } catch (err: unknown) {
      const errorMessage =
        err instanceof Error ? err.message : "Error desconocido";

      if (errorMessage.toLowerCase().includes("email")) {
        setError("email", { message: "Este email ya está registrado" });
      } else if (errorMessage.toLowerCase().includes("usuario")) {
        setError("username", { message: "Nombre de usuario ya ocupado" });
      } else {
        setError("username", { message: errorMessage });
      }
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

          <section className="flex flex-col gap-5 w-full">
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
                maxLength: { value: 15, message: "Máximo 15 caracteres" },
                pattern: {
                  value: /^[a-zA-Z0-9_]+$/,
                  message: "Solo letras, números y guiones bajos",
                },
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
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/i,
                  message: "Email inválido",
                },
              }}
            />

            <PasswordInput
              label="Contraseña"
              name="password"
              control={control}
              placeholder="Mín. 8 caracteres, Mayús. y Núm."
              className="input-underline focus-ring-primary"
              rules={{
                required: "La contraseña es requerida",
                minLength: { value: 8, message: "Mínimo 8 caracteres" },
                pattern: {
                  value: /(?=.*[A-Z])(?=.*[0-9])/,
                  message: "Debe incluir una mayúscula y un número",
                },
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

          {apiError && (
            <div className="w-full p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {apiError}
            </div>
          )}

          <div className="w-full flex justify-center px-1">
            <Buttonav
              path="/login"
              className="text-sm text-primary hover:underline font-medium"
            >
              ¿Ya tienes cuenta? Inicia sesión
            </Buttonav>
          </div>

          <div className="w-full flex flex-col gap-4">
            {/* Botón Principal de Registro */}
            <ButtonAction
              type="submit"
              color="primary"
              disabled={isAuthenticating || !isValid}
              className={`w-full py-3 btn-primary transition-all duration-300 ${
                isAuthenticating || !isValid
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:shadow-lg active:scale-[0.99] brightness-110"
              }`}
            >
              {isAuthenticating ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin text-lg">⏳</span>
                  Creando cuenta...
                </span>
              ) : (
                "Crear cuenta"
              )}
            </ButtonAction>

            {/* Divisor visual decorativo */}
            <div className="relative flex items-center justify-center w-full my-1">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink mx-4 text-gray-400 text-[10px] uppercase tracking-widest font-bold">
                O
              </span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            {/* Botón de Google Siempre Activo */}
            <ButtonAction
              type="button"
              color="primary"
              onClick={() => console.log("Google Register Clicked")}
              className="w-full py-3 btn-primary flex items-center justify-center gap-4 hover:shadow-lg active:scale-[0.99] transition-all duration-300 brightness-110 shadow-md"
            >
              <BsGoogle size={20} className="text-white" />
              <span className="font-bold">Crear cuenta con Google</span>
            </ButtonAction>
          </div>
        </form>
      </div>
    </AuthWrapper>
  );
};

export default Register;
