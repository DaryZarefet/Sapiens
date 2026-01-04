//REACT
import { useForm } from "react-hook-form";

//COMPONENTS
import { Buttonav } from "@/shared/ui/Buttonnav";
import { ButtonAction } from "@/shared/ui/ButtonAction";

// ICONS
import { MdOutlinePerson } from "react-icons/md";
import { MdLockOutline } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import { BsGoogle } from "react-icons/bs";

//TYPES
import type { LOGIN_FORM } from "@/types/formstypes";

const Login = () => {
  const { register, handleSubmit } = useForm<LOGIN_FORM>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (data: LOGIN_FORM) => {
    console.log("submit", data);
  };

  return (
    <div className="flex flex-col gap-4 items-center justify-center w-full min-h-screen p-6 bg-surface text-primary">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center justify-center gap-8 py-6 px-6 sm:px-8 rounded-4xl bg-surface-2 border-default shadow-md w-full max-w-md"
        aria-label="Formulario de inicio de sesión"
      >
        <FaUserCircle size={90} className="fill-blue-950" />

        <section className="flex flex-col gap-5 w-full">
          <label htmlFor="email" className="sr-only">
            Email
          </label>

          <div className="flex items-center gap-3">
            <MdOutlinePerson size={22} className="text-primary flex-shrink-0" />
            <input {...register("email")} name="email" type="email" placeholder="Email" autoComplete="email" className="input-underline focus-ring-primary" />
          </div>

          <label htmlFor="password" className="sr-only">
            Contraseña
          </label>
          <div className="flex items-center gap-3">
            <MdLockOutline size={20} className="text-primary flex-shrink-0" />
            <input
              {...register("password")}
              name="password"
              type="password"
              placeholder="Contraseña"
              autoComplete="current-password"
              className="input-underline focus-ring-primary"
            />
          </div>
        </section>

        <div className="flex flex-col items-center text-md gap-3 w-full">
          <div className="w-full flex justify-between text-sm">
            <Buttonav path="/register" className="text-primary hover:underline hover:text-primary-600 visited:text-muted">
              ¿No tienes cuenta?
            </Buttonav>

            <Buttonav path="/recuperar" className="text-primary hover:underline hover:text-primary-600 visited:text-muted">
              ¿Olvidaste tu contraseña?
            </Buttonav>
          </div>
        </div>

        <div className="w-full">
          <ButtonAction type="submit" color="primary" className="w-full btn-primary" aria-label="Iniciar sesión">
            Iniciar sesión
          </ButtonAction>
        </div>
      </form>

      <ButtonAction type="button" color="primary" className="btn-primary flex items-center gap-5">
        <BsGoogle size={24} />
        Iniciar sesión con Google
      </ButtonAction>
    </div>
  );
};

export default Login;
