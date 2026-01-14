import { timeAgo } from "@/shared/utils/utilsfunctions";
import { MoreOptions } from "../Post/MoreOptions";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Stats } from "../Post/Stats";
import { Avatar } from "../Avatar";
import { ConfirmDelete } from "../Notifications/ConfirmDelete";

//INTERFACES
import type { Post } from "@/types/types";
import type { Option } from "@/types/types";

// ICONS
import { Bookmark, Share2, Trash, Edit } from "lucide-react";

const CategoryBubble = ({ category }: { category: string }) => {
  return (
    <div className="flex items-center gap-1 font-semibold rounded-xl px-2 py-0.5 text-xs bg-surface-2 border border-[var(--color-border)]">
      <span className="text-muted">#</span>
      <p className="text-primary">{category}</p>
    </div>
  );
};

export const PostCard = ({
  post,
  selectable,
  onSelect,
  onDelete,
}: {
  post: Post;
  selectable?: boolean;
  onSelect?: (post: Post) => void;
  onDelete?: (id: number) => void;
}) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const { id, title, description, time, categories, user, institution, type } =
    post;
  const { name } = user;

  const [showConfirm, setShowConfirm] = useState(false);

  // Opciones base disponibles en todas las páginas
  const baseOptions: Option[] = [
    { id: 1, label: "Guardar", Icon: Bookmark },
    { id: 2, label: "Compartir", Icon: Share2 },
  ];

  // En /perfil/publicaciones añadimos Editar y Eliminar.
  // En otras rutas solo mostramos las opciones base (Guardar, Compartir).
  const options: Option[] = [...baseOptions];
  if (pathname === "/perfil/publicaciones") {
    options.push({ id: 3, label: "Editar publicación", Icon: Edit });
    options.push({ id: 4, label: "Eliminar publicación", Icon: Trash });
  }

  const handleSelect = (option: Option) => {
    if (option.label === "Eliminar publicación") {
      setShowConfirm(true);
      return;
    }

    if (option.label === "Editar publicación") {
      navigate("/publicar/documento", { state: { post } });
      return;
    }

    console.log(option);
  };

  const containerClasses =
    pathname === "/comentarios"
      ? "flex flex-col py-3 px-4 gap-2 border-default rounded-lg bg-surface"
      : "flex flex-col py-3 px-4 gap-2 border-b border-gray-200";

  return (
    <article
      id={String(id)}
      className={containerClasses}
      aria-labelledby={`post-title-${id}`}>
      {/* HEADER */}
      <div className="flex text-primary justify-between items-center">
        <div className="flex items-center gap-3">
          <Avatar user={user} size={12} />

          <div className="flex flex-col leading-tight">
            <h3 id={`post-title-${id}`} className="font-bold text-primary">
              {name}
            </h3>

            {institution && <p className="text-sm text-muted">{institution}</p>}

            <div className="flex items-center gap-2 text-xs text-muted">
              <p>{timeAgo(time)}</p>
              {type && (
                <>
                  <div className="bg-[var(--color-border)] rounded-full h-1 w-1" />
                  <p>{type}</p>
                </>
              )}
            </div>
          </div>
        </div>

        <MoreOptions options={options} onSelect={handleSelect} />
        <ConfirmDelete
          isOpen={showConfirm}
          onClose={() => setShowConfirm(false)}
          onConfirm={() => {
            if (onDelete) onDelete(id as number);
            setShowConfirm(false);
          }}
          title="¿Eliminar publicación?"
          message={
            "Esta acción no se puede deshacer. Tu publicación será borrada permanentemente."
          }
        />
      </div>

      {/* BODY (clicable) */}
      <div
        onClick={() => {
          if (selectable && onSelect) return onSelect(post);
          handleNavigate(`/detalles/${id}`);
        }}
        role="button"
        className="flex flex-col gap-2 text-primary cursor-pointer">
        <h3
          className="font-bold text-lg flex items-center gap-2"
          id={`post-title-click-${id}`}>
          {title}
        </h3>
        <p className="text-sm text-muted">{description}</p>
      </div>

      <div className="flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-2">
          {(categories?.length ?? 0) > 0 &&
            categories!.map((category) => (
              <CategoryBubble key={category} category={category} />
            ))}
        </div>
      </div>

      <Stats stats={post} />
    </article>
  );
};
