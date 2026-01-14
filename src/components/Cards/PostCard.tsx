import { timeAgo } from "@/shared/utils/utilsfunctions";
import { MoreOptions } from "../Post/MoreOptions";
import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Avatar } from "../Avatar";
import { ConfirmDelete } from "../Notifications/ConfirmDelete";

//INTERFACES
import type { Post } from "@/types/types";
import type { Option } from "@/types/types";

// ICONS
import {
  Bookmark,
  Share2,
  Trash,
  Edit,
  ThumbsUp,
  ThumbsDown,
  MessageCircle,
  Eye,
} from "lucide-react";

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
  onReply,
}: {
  post: Post;
  selectable?: boolean;
  onSelect?: (post: Post) => void;
  onDelete?: (id: number) => void;
  onReply?: () => void;
}) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const { id, title, description, time, categories, user, institution, type } =
    post;
  // Prioridad: Alias -> Name (que ya tiene username como fallback en el backend/servicio)
  const name = user.alias || user.name;

  const [showConfirm, setShowConfirm] = useState(false);

  // Estados de Reacción
  const [userReaction, setUserReaction] = useState<"LIKE" | "DISLIKE" | null>(
    null
  );
  const [likesCount, setLikesCount] = useState(post.likes || 0);
  const [dislikesCount, setDislikesCount] = useState(post.dislikes || 0);

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

  const handleReaction = (type: "LIKE" | "DISLIKE") => {
    if (userReaction === type) {
      setUserReaction(null);
      if (type === "LIKE") {
        setLikesCount((prev) => prev - 1);
      } else {
        setDislikesCount((prev) => prev - 1);
      }
    } else {
      if (userReaction === "LIKE") setLikesCount((prev) => prev - 1);
      if (userReaction === "DISLIKE") setDislikesCount((prev) => prev - 1);
      setUserReaction(type);
      if (type === "LIKE") {
        setLikesCount((prev) => prev + 1);
      } else {
        setDislikesCount((prev) => prev + 1);
      }
    }
  };

  const containerClasses =
    pathname === "/comentarios"
      ? "flex flex-col py-3 px-4 gap-2 border-default rounded-lg bg-surface"
      : "flex flex-col py-3 px-4 gap-2 border-b border-gray-200";

  return (
    <article
      id={String(id)}
      className={containerClasses}
      aria-labelledby={`post-title-${id}`}
    >
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
        className="flex flex-col gap-2 text-primary cursor-pointer"
      >
        <h3
          className="font-bold text-lg flex items-center gap-2"
          id={`post-title-click-${id}`}
        >
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

      {/* Footer: Métricas y Reacciones */}
      <div className="flex items-center justify-between text-muted text-xs pt-2 mt-1">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 cursor-default">
            <Eye size={16} /> <span>{post.views || 0}</span>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (onReply) {
                onReply();
              } else {
                handleNavigate(`/detalles/${id}`);
              }
            }}
            className="flex items-center gap-1.5 transition-colors group hover:text-blue-500"
          >
            <MessageCircle
              size={16}
              className="group-hover:scale-110 transition-transform"
            />
            <span>{post.messages || 0}</span>
          </button>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleReaction("LIKE");
            }}
            className={`flex items-center gap-1.5 transition-colors ${
              userReaction === "LIKE"
                ? "text-blue-500 font-bold"
                : "hover:text-blue-500"
            }`}
          >
            <ThumbsUp
              size={16}
              fill={userReaction === "LIKE" ? "currentColor" : "none"}
            />
            <span>{likesCount}</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleReaction("DISLIKE");
            }}
            className={`flex items-center gap-1.5 transition-colors ${
              userReaction === "DISLIKE"
                ? "text-red-500 font-bold"
                : "hover:text-red-500"
            }`}
          >
            <ThumbsDown
              size={16}
              fill={userReaction === "DISLIKE" ? "currentColor" : "none"}
            />
            <span>{dislikesCount}</span>
          </button>
        </div>
      </div>
    </article>
  );
};
