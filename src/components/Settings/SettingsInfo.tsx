import { NavCard } from "../NavCard";

export const SettingsCard = () => {
  const infoOptions = [
    { name: "Información de la cuenta", path: "/ajustes/cuenta" },
    { name: "Gestión de notificaciones", path: "/ajustes/notificaciones" },
    { name: "Ajustes de privacidad", path: "/ajustes/privacidad" },
    { name: "Gestión de bloqueos", path: "/ajustes/bloqueados" },
    { name: "Ajustes del sistema", path: "/ajustes/sistema" },
    { name: "Cerrar sesión", path: "/" },
  ];

  return <NavCard title="Gestion de información" listlink={infoOptions} />;
};
