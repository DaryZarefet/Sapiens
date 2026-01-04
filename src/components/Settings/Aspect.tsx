import { Dialog } from "@/shared/dialog/Dialog";

interface AspectProps {
  open: boolean;
  onClose: () => void;
}

export const Aspect = ({ open, onClose }: AspectProps) => {
  return (
    <Dialog title="Eliminar publicación:" open={open} onClose={onClose}>
      <></>
    </Dialog>
  );
};
