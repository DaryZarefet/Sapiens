import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { Avatar } from "../Avatar";
import { ConfirmDelete } from "../Notifications/ConfirmDelete";

interface CommentCardProps {
  comment: Comment;
  onDelete: (id: number) => void;
  onUpdate: (id: number, content: string) => void;
  onReply: (id: number, content: string) => void;
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
  const [editText, setEditText] = useState(comment.content);
  const [replyText, setReplyText] = useState("");
  const editRef = React.useRef<HTMLTextAreaElement>(null);
  const replyRef = React.useRef<HTMLInputElement>(null);

  const isOwner = currentUser?.id === comment.user.id;
  const isEditing =
    activeAction?.type === "EDIT" && activeAction?.id === comment.id;
  const isReplying =
    activeAction?.type === "REPLY" && activeAction?.id === comment.id;
  const isActionDisabled =
    activeAction !== null && activeAction.id !== comment.id;

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

  useEffect(() => {
    if (isEditing && editRef.current) {
      editRef.current.focus();
      const length = editRef.current.value.length;
      editRef.current.setSelectionRange(length, length);
    } else if (isReplying && replyRef.current) {
      replyRef.current.focus();
    }
  }, [isEditing, isReplying]);

  useEffect(() => {
    setEditText(comment.content);
  }, [comment.content]);

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

  // Función unificada para activar respuesta
  const handleReplyTrigger = () => {
    if (isActionDisabled) return;
    setReplyText("");
    setActiveAction({ type: "REPLY", id: comment.id });
  };

  const handleSelect = (option: Option) => {
    if (isActionDisabled) return;
    if (option.id === 3) setIsModalOpen(true);
    if (option.id === 4) {
      setEditText(comment.content);
      setActiveAction({ type: "EDIT", id: comment.id });
    }
    if (option.id === 5) handleReplyTrigger();
  };

  const handleUpdateSubmit = () => {
    if (editText.trim() && editText !== comment.content) {
      onUpdate(comment.id, editText);
      setActiveAction(null);
      toast.success("Comentario actualizado");
    }
  };

  const handleReplySubmit = () => {
    if (replyText.trim()) {
      onReply(comment.id, replyText);
      setReplyText("");
      setActiveAction(null);
      toast.success("Respuesta enviada");
    }
  };

  const handleCancelAction = () => setActiveAction(null);

  return (
    <div
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
            <div className="flex flex-col gap-1 border-b focus-within:border-blue-500 transition-colors">
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
                className="w-full bg-transparent border-none outline-none ring-0 focus:ring-0 p-0 pb-1 text-primary resize-none text-base appearance-none"
                rows={Math.max(1, Math.ceil(editText.length / 60))}
              />
              <div className="flex justify-end gap-3 mb-1">
                <button
                  onClick={handleCancelAction}
                  className="text-muted/50 hover:text-primary transition-colors"
                >
                  <X size={16} />
                </button>
                <button
                  onClick={handleUpdateSubmit}
                  disabled={!editText.trim() || editText === comment.content}
                  className={`text-blue-500 transition-colors ${
                    !editText.trim() || editText === comment.content
                      ? "opacity-30 cursor-not-allowed"
                      : "hover:text-blue-600"
                  }`}
                >
                  <Check size={16} />
                </button>
              </div>
            </div>
          ) : (
            <p className="whitespace-pre-wrap break-words">{comment.content}</p>
          )}
        </div>

        {/* FOOTER DEL COMENTARIO CON ACCIONES DINÁMICAS */}
        <div className="flex items-center justify-between text-muted text-xs pt-1">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 cursor-default">
              <Eye size={14} /> <span>{comment.views || 0}</span>
            </div>

            {/* BOTÓN DE RESPUESTA DINÁMICO */}
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

        {isReplying && (
          <div className="mt-2 p-3 bg-surface-2 rounded-xl border border-default">
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
                <button
                  onClick={handleReplySubmit}
                  disabled={!replyText.trim()}
                  className={`text-blue-500 ml-2 p-1 rounded-full transition-colors ${
                    !replyText.trim() ? "opacity-30" : "hover:bg-surface"
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
