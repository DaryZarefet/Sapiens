import { ContactItem, type Contact } from "./Contact";

export const SideBarContacts = () => {
  const contactsSample: Contact[] = [
    {
      id: "1",
      name: "María García",
      lastMessage: "Nos vemos mañana a las 10",
      avatarUrl: "",
      unread: 2,
      lastTime: "11:20",
    },
    {
      id: "2",
      name: "Equipo Ventas",
      lastMessage: "Reporte enviado ✅",
      avatarUrl: "",
      unread: 0,
      lastTime: "09:05",
    },
    {
      id: "3",
      name: "Carlos",
      lastMessage: "Perfecto, gracias bro",
      avatarUrl: "",
      unread: 1,
      lastTime: "Hoy",
    },
    {
      id: "4",
      name: "Diseño UX",
      lastMessage: "Te mando los cambios hoy",
      avatarUrl: "",
      unread: 0,
      lastTime: "Lun",
    },
    {
      id: "5",
      name: "Soporte Técnico",
      lastMessage: "El ticket sigue en proceso",
      avatarUrl: "",
      unread: 3,
      lastTime: "Dom",
    },
  ];

  return (
    <aside className="col-span-4 md:col-span-3 lg:col-span-3 border-r border-gray-200 bg-white">
      <div className="p-3.5 border-b border-gray-200 flex items-center justify-between">
        <h2 className="text-lg font-semibold">Contactos:</h2>
        <button
          type="button"
          className="text-sm px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          aria-label="Nuevo chat"
        >
          Nuevo
        </button>
      </div>

      <div className="p-3">
        <input
          type="text"
          placeholder="Buscar contactos"
          className="w-full px-3 py-2 rounded-md border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          aria-label="Buscar contacto:"
        />
      </div>

      <div className="px-2 pb-3 overflow-y-auto" style={{ maxHeight: "calc(100% - 140px)" }}>
        <ul className="space-y-1">
          {contactsSample.map((c) => (
            <li key={c.id}>
              <ContactItem contact={c} />
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
};
