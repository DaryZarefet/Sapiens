//REACT
import { useForm } from "react-hook-form";

//COMPONENTS
import { ButtonAction } from "@/shared/ui/ButtonAction";
import { Buttonav } from "@/shared/ui/Buttonnav";

//ICONS
import { BsGoogle } from "react-icons/bs";
import { MdOutlinePerson } from "react-icons/md";
import { MdLockOutline } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";

//TYPES
import type { REGISTER_FORM } from "@/types/formstypes";

const Register = () => {
  const { handleSubmit, register } = useForm<REGISTER_FORM>({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirm_password: "",
    },
  });

  const onSubmit = (data: REGISTER_FORM) => {
    console.log("submit", data);
  };

  return (
    <div className="flex flex-col gap-4 items-center justify-center w-full h-screen p-10 bg-surface">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center justify-center gap-8 py-6 px-6 sm:px-8 rounded-4xl bg-surface-2 border-default shadow-md w-full max-w-md"
      >
        <FaUserCircle size={90} className="fill-blue-950" />

        <section className="flex flex-col gap-5 w-full">
          <div className="flex items-center gap-3">
            <MdOutlinePerson size={24} className="text-primary" />
            <input {...register("username")} name="username" type="text" placeholder="Nombre de usuario" className="input-underline focus-ring-primary" />
          </div>

          <div className="flex items-center gap-3">
            <MdOutlinePerson size={24} className="text-primary" />
            <input {...register("email")} name="email" type="email" placeholder="Email" className="input-underline focus-ring-primary" />
          </div>

          <div className="flex items-center gap-3">
            <MdLockOutline size={22} className="text-primary" />
            <input {...register("password")} name="password" type="password" placeholder="Contraseña" className="input-underline focus-ring-primary" />
          </div>

          <div className="flex items-center gap-3">
            <MdLockOutline size={22} className="text-primary" />
            <input
              {...register("confirm_password")}
              name="confirm_password"
              type="password"
              placeholder="Confirmar contraseña"
              className="input-underline focus-ring-primary"
            />
          </div>
        </section>

        <div className="flex gap-16">
          <Buttonav path="/login" className="text-sm text-primary hover:underline hover:text-primary-600 visited:text-primary cursor-pointer">
            ¿Ya tienes cuenta?
          </Buttonav>
        </div>

        <div className="w-full">
          <ButtonAction type="submit" color="primary" className="w-full btn-primary" aria-label="Iniciar sesión">
            Crear cuenta
          </ButtonAction>
        </div>
      </form>

      <ButtonAction type="button" color="primary" className="btn-primary flex items-center gap-5">
        <BsGoogle size={24} />
        Crear cuenta con Google
      </ButtonAction>
    </div>
  );
};

export default Register;
