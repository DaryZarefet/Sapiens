import React, { useState, useEffect, useRef } from "react";
import { timeAgo } from "@/shared/utils/utilsfunctions";
import { MoreOptions } from "../Post/MoreOptions";
import { useAuthContext } from "@/context/AuthContext";
import { toast } from "sonner";
import type { Comment, Option, ActiveAction } from "@/types/types";
import {
  Bookmark,
  Share2,
  Trash,
  Edit2,
  Check,
  X,
  Send,
  Eye,
  MessageCircle,
  ThumbsUp,
  ThumbsDown,
  Paperclip, // Importamos Paperclip
} from "lucide-react";
import { Avatar } from "../Avatar";
import { ConfirmDelete } from "../Notifications/ConfirmDelete";

interface CommentCardProps {
  comment: Comment;
  onDelete: (id: number) => void;
  // Actualizamos interfaces para aceptar imagen
  onUpdate: (id: number, content: string, image?: string) => void;
  onReply: (id: number, content: string, image?: string) => void;
  isReply?: boolean;
  activeAction: ActiveAction;
  setActiveAction: (action: ActiveAction) => void;
}

export const CommentCard = ({
  comment,
  onDelete,
  onUpdate,
  onReply,
  isReply = false,
  activeAction,
  setActiveAction,
}: CommentCardProps) => {
  const { user: currentUser } = useAuthContext();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Estados para Edición
  const [editText, setEditText] = useState(comment.content);
  const [editImage, setEditImage] = useState<string | undefined>(comment.image);

  // Estados para Respuesta
  const [replyText, setReplyText] = useState("");
  const [replyImage, setReplyImage] = useState<string | undefined>(undefined);

  // Refs
  const editRef = useRef<HTMLTextAreaElement>(null);
  const replyRef = useRef<HTMLInputElement>(null);
  const fileInputEditRef = useRef<HTMLInputElement>(null);
  const fileInputReplyRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null); // Para el scroll focus

  const isOwner = currentUser?.id === comment.user.id;
  const isEditing =
    activeAction?.type === "EDIT" && activeAction?.id === comment.id;
  const isReplying =
    activeAction?.type === "REPLY" && activeAction?.id === comment.id;
  const isActionDisabled =
    activeAction !== null && activeAction.id !== comment.id;

  // Lógica de cambios para activar/desactivar botón guardar
  const hasChanges =
    editText !== comment.content || editImage !== comment.image;

  const [userReaction, setUserReaction] = useState<"LIKE" | "DISLIKE" | null>(
    null
  );
  const [likesCount, setLikesCount] = useState(comment.likes || 0);
  const [dislikesCount, setDislikesCount] = useState(comment.dislikes || 0);

  const handleReaction = (type: "LIKE" | "DISLIKE") => {
    if (userReaction === type) {
      setUserReaction(null);
      if (type === "LIKE") setLikesCount((prev) => prev - 1);
      else setDislikesCount((prev) => prev - 1);
    } else {
      if (userReaction === "LIKE") setLikesCount((prev) => prev - 1);
      if (userReaction === "DISLIKE") setDislikesCount((prev) => prev - 1);
      setUserReaction(type);
      if (type === "LIKE") setLikesCount((prev) => prev + 1);
      else setDislikesCount((prev) => prev + 1);
    }
  };

  // Efecto: Focus, Cursor al final y Scroll Automático
  useEffect(() => {
    if (isEditing && editRef.current) {
      editRef.current.focus();
      const length = editRef.current.value.length;
      editRef.current.setSelectionRange(length, length);
      setEditImage(comment.image); // Reset image on open
      // Scroll focus
      cardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    } else if (isReplying && replyRef.current) {
      replyRef.current.focus();
      // Scroll focus
      cardRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isEditing, isReplying]);

  useEffect(() => {
    setEditText(comment.content);
    setEditImage(comment.image);
  }, [comment.content, comment.image]);

  // Manejo de Archivos (Igual que Commentbox)
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    mode: "EDIT" | "REPLY"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("El archivo debe ser una imagen");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (mode === "EDIT") setEditImage(reader.result as string);
        else setReplyImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const options: Option[] = [
    { id: 1, label: "Guardar", Icon: Bookmark },
    { id: 2, label: "Compartir", Icon: Share2 },
    { id: 5, label: "Responder", Icon: MessageCircle },
  ];

  if (isOwner) {
    options.push(
      { id: 4, label: "Editar", Icon: Edit2 },
      { id: 3, label: "Eliminar", Icon: Trash }
    );
  }

  const handleReplyTrigger = () => {
    if (isActionDisabled) return;
    setReplyText("");
    setReplyImage(undefined);
    setActiveAction({ type: "REPLY", id: comment.id });
  };

  const handleSelect = (option: Option) => {
    if (isActionDisabled) return;
    if (option.id === 3) setIsModalOpen(true);
    if (option.id === 4) {
      setEditText(comment.content);
      setEditImage(comment.image);
      setActiveAction({ type: "EDIT", id: comment.id });
    }
    if (option.id === 5) handleReplyTrigger();
  };

  const handleUpdateSubmit = () => {
    // Validación estricta: debe haber texto o imagen, Y debe haber cambios
    if ((editText.trim() || editImage) && hasChanges) {
      onUpdate(comment.id, editText, editImage);
      setActiveAction(null);
      toast.success("Comentario actualizado");
    }
  };

  // Dentro de CommentCard.tsx, busca esta función:
  const handleReplySubmit = () => {
    if (replyText.trim() || replyImage) {
      // IMPORTANTE: Asegúrate de pasar replyImage aquí como tercer argumento
      onReply(comment.id, replyText, replyImage);

      setReplyText("");
      setReplyImage(undefined);
      setActiveAction(null);
      toast.success("Respuesta enviada");
    }
  };

  const handleCancelAction = () => {
    setActiveAction(null);
    setReplyImage(undefined);
    setEditImage(comment.image);
  };

  return (
    <div
      ref={cardRef}
      className={`flex flex-col ${
        isReply ? "ml-8 border-l border-default/20 pl-4 mt-2" : "mt-4"
      }`}
    >
      <article
        className={`flex flex-col py-4 px-5 gap-3 border border-default rounded-2xl bg-surface shadow-sm transition-all duration-300 ${
          isActionDisabled ? "opacity-60 pointer-events-none" : "opacity-100"
        }`}
      >
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-10 h-10">
              <Avatar user={comment.user} size={10} />
            </div>
            <div className="flex flex-col leading-tight">
              <h3 className="font-bold text-sm text-primary">
                {comment.user.name}
              </h3>
              <span className="text-[10px] text-muted">
                {timeAgo(comment.time)}
              </span>
            </div>
          </div>
          <div
            className={`relative w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200 ${
              isActionDisabled
                ? "opacity-20 cursor-not-allowed"
                : "hover:bg-gray-100 dark:hover:bg-surface-2 active:scale-95 cursor-pointer"
            }`}
          >
            <div className="absolute inset-0 flex items-center justify-center [&>button]:w-full [&>button]:h-full [&>button]:flex [&>button]:items-center [&>button]:justify-center [&>button]:cursor-pointer">
              <MoreOptions options={options} onSelect={handleSelect} />
            </div>
          </div>
        </div>

        <div className="text-[14.5px] text-primary">
          {isEditing ? (
            <div className="flex flex-col gap-3 border-b border-blue-500/30 transition-colors pb-2">
              {/* PREVIEW IMAGEN EN EDICIÓN */}
              {editImage && (
                <div className="relative inline-block self-start mb-1">
                  <img
                    src={editImage}
                    alt="Preview"
                    className="max-h-52 w-auto rounded-xl border border-default object-contain shadow-sm bg-surface-2"
                  />
                  <button
                    onClick={() => {
                      setEditImage(undefined);
                      if (fileInputEditRef.current)
                        fileInputEditRef.current.value = "";
                    }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-lg hover:bg-red-600 transition-all active:scale-90"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              <textarea
                ref={editRef}
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    e.stopPropagation();
                    handleUpdateSubmit();
                  }
                  if (e.key === "Escape") {
                    e.stopPropagation();
                    handleCancelAction();
                  }
                }}
                className="w-full bg-transparent border-none outline-none ring-0 focus:ring-0 p-0 text-primary resize-none text-base appearance-none"
                rows={Math.max(1, Math.ceil(editText.length / 60))}
              />

              <div className="flex justify-between items-center pt-1">
                {/* BOTÓN CLIP (Estilo exacto Commentbox) */}
                <div>
                  <input
                    type="file"
                    ref={fileInputEditRef}
                    onChange={(e) => handleFileChange(e, "EDIT")}
                    accept="image/*"
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputEditRef.current?.click()}
                    className={`group relative p-2.5 rounded-full transition-all duration-300 ease-out active:scale-90 ${
                      editImage
                        ? "text-blue-500 bg-blue-50 dark:bg-blue-500/10 shadow-sm"
                        : "text-muted hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-500"
                    }`}
                  >
                    <Paperclip
                      size={20}
                      className={`transition-transform duration-300 ${
                        editImage
                          ? "rotate-45"
                          : "group-hover:-rotate-12 group-hover:scale-110"
                      }`}
                    />
                    {editImage && (
                      <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-blue-500 border-2 border-surface rounded-full animate-pulse" />
                    )}
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleCancelAction}
                    className="text-muted/50 hover:text-primary transition-colors"
                  >
                    <X size={16} />
                  </button>
                  <button
                    onClick={handleUpdateSubmit}
                    disabled={(!editText.trim() && !editImage) || !hasChanges}
                    className={`text-blue-500 transition-colors ${
                      (!editText.trim() && !editImage) || !hasChanges
                        ? "opacity-30 cursor-not-allowed"
                        : "hover:text-blue-600 hover:scale-110 transform"
                    }`}
                  >
                    <Check size={16} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <p className="whitespace-pre-wrap break-words">
                {comment.content}
              </p>
              {/* MOSTRAR IMAGEN SI EXISTE */}
              {comment.image && (
                <div className="max-w-md overflow-hidden rounded-xl border border-default bg-surface-2 shadow-sm">
                  <img
                    src={comment.image}
                    alt="Adjunto"
                    className="w-full h-auto object-cover cursor-zoom-in"
                    onClick={() => window.open(comment.image, "_blank")}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* FOOTER DEL COMENTARIO */}
        <div className="flex items-center justify-between text-muted text-xs pt-1">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 cursor-default">
              <Eye size={14} /> <span>{comment.views || 0}</span>
            </div>

            <button
              onClick={handleReplyTrigger}
              className={`flex items-center gap-1.5 transition-colors group ${
                isActionDisabled ? "cursor-not-allowed" : "hover:text-blue-500"
              }`}
            >
              <MessageCircle
                size={14}
                className={`transition-all ${
                  isReplying
                    ? "fill-blue-500 text-blue-500"
                    : "group-hover:scale-110"
                }`}
              />
              <span className={isReplying ? "text-blue-500 font-medium" : ""}>
                {comment.replies?.length || 0}
              </span>
            </button>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => handleReaction("LIKE")}
              className={`flex items-center gap-1.5 transition-colors ${
                userReaction === "LIKE"
                  ? "text-blue-500 font-bold"
                  : "hover:text-blue-500"
              }`}
            >
              <ThumbsUp
                size={14}
                fill={userReaction === "LIKE" ? "currentColor" : "none"}
              />
              <span>{likesCount}</span>
            </button>
            <button
              onClick={() => handleReaction("DISLIKE")}
              className={`flex items-center gap-1.5 transition-colors ${
                userReaction === "DISLIKE"
                  ? "text-red-500 font-bold"
                  : "hover:text-red-500"
              }`}
            >
              <ThumbsDown
                size={14}
                fill={userReaction === "DISLIKE" ? "currentColor" : "none"}
              />
              <span>{dislikesCount}</span>
            </button>
          </div>
        </div>

        {/* AREA DE RESPUESTA */}
        {isReplying && (
          <div className="mt-2 p-3 bg-surface-2 rounded-xl border border-default flex flex-col gap-3">
            {/* PREVIEW IMAGEN EN RESPUESTA */}
            {replyImage && (
              <div className="relative inline-block self-start">
                <img
                  src={replyImage}
                  alt="Reply Preview"
                  className="max-h-40 w-auto rounded-xl border border-default object-contain shadow-sm bg-surface"
                />
                <button
                  onClick={() => {
                    setReplyImage(undefined);
                    if (fileInputReplyRef.current)
                      fileInputReplyRef.current.value = "";
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-all active:scale-90"
                >
                  <X size={12} />
                </button>
              </div>
            )}

            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-7 h-7">
                <Avatar user={currentUser} size={7} />
              </div>
              <div className="flex-1 flex items-center border-b focus-within:border-blue-500 transition-colors">
                <input
                  ref={replyRef}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Responder a ${comment.user.name}...`}
                  className="w-full bg-transparent border-none outline-none ring-0 focus:ring-0 text-sm py-1 px-0 text-primary appearance-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      e.stopPropagation();
                      handleReplySubmit();
                    }
                    if (e.key === "Escape") {
                      e.stopPropagation();
                      handleCancelAction();
                    }
                  }}
                />

                {/* BOTÓN CLIP EN RESPUESTA (Estilo exacto Commentbox, tamaño ajustado) */}
                <input
                  type="file"
                  ref={fileInputReplyRef}
                  onChange={(e) => handleFileChange(e, "REPLY")}
                  accept="image/*"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputReplyRef.current?.click()}
                  className={`group relative p-1.5 mr-1 rounded-full transition-all duration-300 ease-out active:scale-90 ${
                    replyImage
                      ? "text-blue-500 bg-blue-50 dark:bg-blue-500/10"
                      : "text-muted hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-500"
                  }`}
                >
                  <Paperclip
                    size={16}
                    className={`transition-transform duration-300 ${
                      replyImage
                        ? "rotate-45"
                        : "group-hover:-rotate-12 group-hover:scale-110"
                    }`}
                  />
                </button>

                <button
                  onClick={handleReplySubmit}
                  disabled={!replyText.trim() && !replyImage}
                  className={`text-blue-500 ml-1 p-1 rounded-full transition-colors ${
                    !replyText.trim() && !replyImage
                      ? "opacity-30"
                      : "hover:bg-surface"
                  }`}
                >
                  <Send size={14} />
                </button>
              </div>
              <button
                onClick={handleCancelAction}
                className="text-muted/40 hover:text-primary transition-colors"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}
      </article>

      {/* RECURSIVIDAD Y JERARQUÍA VISUAL INTACTA */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="flex flex-col mt-2 relative">
          <div className="absolute left-[19px] top-0 bottom-4 w-[2px] bg-default/20" />
          {comment.replies.map((reply) => (
            <div key={reply.id} className="relative">
              <div className="absolute left-[19px] top-[24px] w-4 h-[2px] bg-default/20 rounded-bl-xl" />
              <div className="ml-9">
                <CommentCard
                  comment={reply}
                  onDelete={onDelete}
                  onUpdate={onUpdate}
                  onReply={onReply}
                  isReply={true}
                  activeAction={activeAction}
                  setActiveAction={setActiveAction}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDelete
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={() => {
          onDelete(comment.id);
          setIsModalOpen(false);
          toast.error("Comentario eliminado");
        }}
      />
    </div>
  );
};
