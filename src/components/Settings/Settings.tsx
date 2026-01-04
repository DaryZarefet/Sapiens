import { Buttonav } from "@/shared/ui/Buttonnav";
import { AsidePost } from "../AsidePost";
import { Bell, type LucideIcon, Settings as SettingsIcon, UserCog, LockIcon } from "lucide-react";

type SettingsNav = {
  name: string;
  path: string;
  icon: LucideIcon;
};

const Settings = () => {
  const settingsnavs: SettingsNav[] = [
    { name: "Informacion", path: "/ajustes/informacion", icon: SettingsIcon },
    { name: "Cuenta", path: "/ajustes/cuenta", icon: UserCog },
    { name: "Notificaciones", path: "/notificaciones", icon: Bell },
    { name: "Privacidad", path: "/ajustes/privacidad", icon: LockIcon },
    { name: "Usuarios bloqueados", path: "/ajustes/usuarios-bloqueados", icon: LockIcon },
    { name: "Sistema", path: "/ajustes/sistema", icon: LockIcon },
  ];

  const informacionsettings = [{ name: "Gestion de correo" }];

  const notificacionessettings = [
    { name: "Alguien comento o te respondio", relation: "You" },
    { name: "Alguien te dio me gusta", relation: "You" },
    { name: "Alguien comenzo a seguirte", relation: "You" },
    { name: "Menciones", relation: "You" },
    { name: "Sistema", relation: "Sistem" },
    { name: "Eventos", relation: "Sistem" },
  ];

  const privacidadsettings = [
    { name: "Mostrar las publicaciones que he publicado en mi página personal" },
    { name: "Mostrar los comentarios que he publicado en mi página personal" },
    { name: "Mostrar la lista de usuarios que sigo en mi perfil" },
    { name: "Mostrar los usuarios que me siguen en mi perfil" },
    { name: "Se pueden hacer comentarios en mis publicaciones y comentarios" },
    { name: "Pueden compartirse mis publicaciones" },
    { name: "Pueden guardarse mis publicaciones" },
    { name: "Puedo ser mencionado con (@)" },
  ];

  const sistemasettings = [{ name: "Ajustes de apariencia" }];

  return (
    <div className="flex justify-center gap-8 w-full py-5 px-5 lg:px-10 xl:px-20">
      {/* Sticky solo en pantallas grandes; limitar altura y permitir scroll interno */}
      <div className="w-80">
        <div className="bg-surface-2  border-default rounded-2xl shadow-sm ">
          <nav className="flex flex-col rounded-md">
            {settingsnavs.map(({ name, path, icon: Icon }) => (
              <Buttonav path={path} className="w-full p-5 flex items-center text-primary hover:bg-surface transition">
                <div className="flex gap-5 items-center">
                  <Icon size={20} className="text-primary" />
                  <span className="text-lg font-medium truncate">{name}</span>
                </div>
              </Buttonav>
            ))}
          </nav>
        </div>
      </div>

      <div className="flex-1 max-w-[640px]">
        <div className="bg-surface-2  border-default rounded-2xl shadow-sm ">
          <div className="bg-surface-2 border-b border-[var(--color-border)] px-4">
            <div className="h-16 flex items-center justify-between">
              <h2 id="navcard-heading" className="font-semibold text-lg text-primary">
                Notificaciones
              </h2>
            </div>
          </div>
          <nav className="flex flex-col rounded-md">
            {settingsnavs.map(({ name, path, icon: Icon }) => (
              <Buttonav path={path} className="w-full p-5 flex items-center text-primary hover:bg-surface transition">
                <div className="flex gap-5 items-center">
                  <Icon size={20} className="text-primary" />
                  <span className="text-lg font-medium truncate">{name}</span>
                </div>
              </Buttonav>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Settings;
