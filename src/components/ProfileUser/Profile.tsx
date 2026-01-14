import { useIsDesktop } from "@/shared/ui/useIsDesktop";
import { Buttonav } from "@/shared/ui/Buttonnav";
import { ScrollCard } from "../Cards/ScrollCard";
import { examplePosts } from "@/mock/mockpublic";
import { usePostStore } from "@/mock/usePostStore";

// INTERFACES
import type { User } from "@/types/types";

// ICONS
import { Edit, Flag, MoreHorizontal, UserLock } from "lucide-react";
import { PanelOptions } from "../Headers/PanelOptions";
import { useEffect, useRef, useState } from "react";

// ASSETS - Importamos la imagen por defecto
import defaultBg from "@/assets/images/image.png";
import defaultAvatar from "@/assets/images/avatar.png";

const Navs = ({
  path,
  title,
  number,
}: {
  path: string;
  title: string;
  number: number;
}) => {
  return (
    <Buttonav
      path={path}
      className="p-3 py-2 flex items-center gap-2 bg-surface-2 border-default rounded-xl hover:bg-surface-2"
    >
      <span className="text-sm text-primary">{title}</span>
      <span className="text-sm font-bold text-primary">{number}</span>
    </Buttonav>
  );
};

export const Profile = ({
  user,
  type,
}: {
  user: User | null;
  type: boolean;
}) => {
  // HOOKS SIEMPRE AL PRINCIPIO
  const isDesktop = useIsDesktop(1024);
  const [openPanel, setOpenPanel] = useState<string | null>(null);
  const rightActionsRef = useRef<HTMLDivElement | null>(null);
  const allPosts = usePostStore((s) => s.posts);

  // EFECTOS SIEMPRE AL PRINCIPIO
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        rightActionsRef.current &&
        !rightActionsRef.current.contains(event.target as Node)
      ) {
        setOpenPanel(null); // Usamos setOpenPanel directamente
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-primary">Perfil no disponible</p>
      </div>
    );
  }

  const background = user.background;
  // Prioridad: Alias -> Username -> Name -> "Usuario"
  const name = user.alias || user.username || user.name || "Usuario";
  const note = user.note;
  const avatar = user.avatar;

  const publicacionesCount = allPosts.filter(
    (p) => p.user?.id === user.id
  ).length;

  const profilenavs = [
    {
      path: "/perfil/publicaciones",
      title: "Publicaciones",
      number: publicacionesCount,
    },
    { path: "/perfil/siguiendo", title: "Siguiendo", number: 20 },
    { path: "/perfil/seguidores", title: "Seguidores", number: 20 },
    { path: "/perfil/me-gusta", title: "Me gusta", number: 10 },
  ];

  const infonavs = [
    { name: "Publicaciones", path: "/perfil/publicaciones" },
    { name: "Comentarios", path: "/perfil/comentarios" },
    { name: "Guardados", path: "/perfil/guardados" },
    { name: "Me gusta", path: "/perfil/me-gusta" },
  ];

  const handleMouseEnter = (panel: string) => {
    setOpenPanel(panel);
  };

  const buttonsoptions = [
    { name: "Denunciar usuario", path: "/perfil/321", icon: Flag },
    { name: "Bloquear usuario", path: "/perfil/321", icon: UserLock },
  ];

  return (
    <section className="bg-surface min-h-screen w-full text-primary">
      {/* PROFILE INFO */}
      <div className="relative">
        <div className={isDesktop ? "ml-0" : ""}>
          <div className="w-full overflow-hidden rounded-b-md">
            <img
              // SOLUCIÓN: Si background es null/undefined, usa defaultBg
              src={background || defaultBg}
              alt={`${name} background`}
              className="w-full h-44 md:h-56 object-cover"
              // Por si la URL existe pero la imagen no carga
              onError={(e) => {
                (e.target as HTMLImageElement).src = defaultBg;
              }}
            />
          </div>

          <div className="relative">
            <div
              className={
                "absolute flex flex-row left-11 transform -translate-y-1/2 -top-8 gap-10"
              }
            >
              <img
                src={avatar || defaultAvatar}
                alt={`${name} avatar`}
                className="w-32 h-32 rounded-full object-cover border-4 border-surface"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = defaultAvatar;
                }}
              />

              <div className="md:mt-8 mb-4 pl-0">
                <h2 className="text-xl md:text-2xl font-semibold text-white px-0">
                  {name || "Usuario"}
                </h2>
                {note && <p className="text-sm mt-1 text-gray-300">{note}</p>}
              </div>
            </div>

            <div className="flex items-center justify-between py-4 px-52 border-b border-[var(--color-border)] bg-surface-2">
              <div className="flex gap-2 ">
                {profilenavs.map((nav) =>
                  nav.title === "Publicaciones" ? (
                    <div
                      key={nav.path}
                      className="p-3 py-2 flex items-center gap-2 bg-surface-2 border-default rounded-xl"
                    >
                      <span className="text-sm text-primary">{nav.title}</span>
                      <span className="text-sm font-bold text-primary">
                        {nav.number}
                      </span>
                    </div>
                  ) : (
                    <Navs key={nav.path} {...nav} />
                  )
                )}
              </div>

              <div className="flex gap-2 " ref={rightActionsRef}>
                {type ? (
                  <Buttonav
                    path="/perfil/editar"
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-2 border-default transition"
                  >
                    <Edit size={18} className="text-primary" />
                    <span className="text-sm font-medium text-primary">
                      Editar
                    </span>
                  </Buttonav>
                ) : (
                  <>
                    <div
                      className="relative inline-block"
                      onMouseEnter={() => handleMouseEnter("more")}
                    >
                      {/* HOVER EFFECT: Se agregó el cambio de color al pasar el mouse */}
                      <button className="flex items-center justify-center w-10 h-10 rounded-xl bg-surface-2 border-default hover:bg-blue-50 dark:hover:bg-blue-500/10 transition-all group active:scale-95">
                        <MoreHorizontal
                          size={18}
                          className="group-hover:text-blue-500 transition-colors"
                        />
                      </button>
                      {openPanel === "more" && (
                        <PanelOptions title="Más" buttons={buttonsoptions} />
                      )}
                    </div>

                    <div
                      className="inline-block"
                      onMouseEnter={() => handleMouseEnter("follow")}
                    >
                      <Buttonav
                        path="/perfil/editar"
                        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-surface-2 border-default transition"
                      >
                        <span className="text-sm font-medium ">Seguir</span>
                      </Buttonav>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-6">
        <ScrollCard posts={examplePosts} navs={infonavs} />
      </div>
    </section>
  );
};
