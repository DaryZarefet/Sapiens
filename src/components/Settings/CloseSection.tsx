import { Dialog } from "@/shared/dialog/Dialog";

export const CloseSection = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  return (
    <Dialog title="Cerrar sesión" open={open} onClose={onClose}>
      <div className="flex flex-col gap-4 p-4">
        Esta seguro de que deseas cerrar sesión? Se perderan todos los datos
        guardados.
      </div>
      <div className="flex gap-4 items-center justify-end">
        <button
          onClick={onClose}
          className="w-full max-w-3xl bg-gray-700 py-3 text-white font-bold rounded-2xl shadow-lg"
          aria-label="Guardar"
        >
          Aceptar
        </button>

        <button
          onClick={onClose}
          className="w-full max-w-3xl bg-gray-700 py-3 text-white font-bold rounded-2xl shadow-lg"
          aria-label="Guardar"
        >
          Cancelar
        </button>
      </div>
    </Dialog>
  );
};
