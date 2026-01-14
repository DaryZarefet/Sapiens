import React, { useState, useEffect, useRef } from "react";
import { useIsDesktop } from "@/shared/ui/useIsDesktop";
import { Paperclip, Send, X, Smile } from "lucide-react";
import { PostCard } from "../Cards/PostCard";
import { CommentCard } from "../Cards/CommentCard";
import { exampleComments } from "@/mock/mockcomments";
import { Avatar } from "../Avatar";
import { useAuthContext } from "@/context/AuthContext";
import { commentService } from "@/services/commentService";
import type { Comment, ActiveAction, Post } from "@/types/types";
import { toast } from "sonner";

const post: Post = {
  id: 100,
  title:
    "Revisión exhaustiva de sistemas de administración de fármacos mediada por nanopartículas",
  description:
    "Revisión de estrategias basadas en nanopartículas para la administración dirigida de fármacos.",
  time: "2025-10-20T10:00:00Z",
  categories: ["Nanomedicina"],
  views: 1240,
  messages: 18,
  likes: 230,
  dislikes: 3,
  documentUrl: "https://doi.org/10.1234/example.doi.2025.001",
  user: {
    id: 0,
    name: "Equipo Editorial",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
    role: { id: 3, name: "moderador" },
  },
};

const Commentbox: React.FC = () => {
  const { user } = useAuthContext();
  const isDesktop = useIsDesktop(1024);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [comments, setComments] = useState<Comment[]>(() => {
    const saved = localStorage.getItem("local_comments");
    return saved ? JSON.parse(saved) : exampleComments;
  });
  const [text, setText] = useState("");
  const [activeAction, setActiveAction] = useState<ActiveAction>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem("local_comments", JSON.stringify(comments));
  }, [comments]);

  const handleClipClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("El archivo debe ser una imagen");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Máximo 5MB permitido");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSendComment = () => {
    if ((!text.trim() && !imagePreview) || !user) return;

    const baseComment = commentService.createComment(text, user);

    const newComment: Comment = {
      ...baseComment,
      // Aquí está el truco: si imagePreview es null, se convierte en undefined
      image: imagePreview || undefined,
    };

    setComments([newComment, ...comments]);
    setText("");
    clearImage();
    toast.success("Comentario publicado");
  };

  const handleDelete = (id: number) => {
    const filterRecursive = (list: Comment[]): Comment[] =>
      list
        .filter((c) => c.id !== id)
        .map((c) => ({
          ...c,
          replies: c.replies ? filterRecursive(c.replies) : [],
        }));
    setComments(filterRecursive(comments));
    if (activeAction?.id === id) setActiveAction(null);
  };

  const handleUpdate = (id: number, content: string, image?: string) => {
    const updateRecursive = (list: Comment[]): Comment[] =>
      list.map((c) =>
        c.id === id
          ? { ...c, content, image } // Aquí actualizas ambos campos
          : { ...c, replies: c.replies ? updateRecursive(c.replies) : [] }
      );
    setComments(updateRecursive(comments));
  };

  // Actualiza la función handleReply en Commentbox.tsx
  const handleReply = (parentId: number, replyText: string, image?: string) => {
    if (!user) return;

    // Creamos el comentario base
    const baseReply = commentService.createComment(replyText, user);

    // Le inyectamos la imagen si viene una
    const newReply: Comment = {
      ...baseReply,
      image: image || undefined,
    };

    const addReplyRecursive = (list: Comment[]): Comment[] =>
      list.map((c) =>
        c.id === parentId
          ? { ...c, replies: [newReply, ...(c.replies || [])] }
          : { ...c, replies: c.replies ? addReplyRecursive(c.replies) : [] }
      );

    setComments(addReplyRecursive(comments));
    setActiveAction(null);
  };

  return (
    <div className={`bg-surface py-8 ${isDesktop ? "px-10" : "px-4"}`}>
      <div className="max-w-4xl mx-auto">
        <PostCard
          post={post}
          onReply={() => {
            textareaRef.current?.focus();
            textareaRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
          }}
        />

        <div className="mt-10">
          <h3 className="text-xl font-bold mb-6 text-primary">Comentarios</h3>

          <div
            className={`mb-8 p-5 bg-surface rounded-2xl border border-default shadow-sm transition-opacity ${
              activeAction ? "opacity-50 pointer-events-none" : "opacity-100"
            }`}
          >
            <div className="flex items-start gap-4">
              <Avatar user={user} size={10} />
              <div className="flex-1">
                <div className="flex flex-col border-b focus-within:border-blue-500 transition-colors">
                  {/* VISTA PREVIA DE IMAGEN */}
                  {imagePreview && (
                    <div className="relative inline-block mb-3 self-start">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-h-52 w-auto rounded-xl border border-default object-contain shadow-sm bg-surface-2"
                      />
                      <button
                        onClick={clearImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1.5 shadow-lg hover:bg-red-600 transition-all active:scale-90"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  )}

                  <textarea
                    ref={textareaRef}
                    rows={1}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendComment();
                      }
                    }}
                    placeholder="Escribe tu comentario..."
                    className="w-full bg-transparent border-none outline-none ring-0 focus:ring-0 p-0 pb-1 text-primary placeholder:text-muted/50 resize-none text-base"
                  />
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex gap-1">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />

                    <button
                      onClick={handleClipClick}
                      className={`group relative p-2.5 rounded-full transition-all duration-300 ease-out active:scale-90 ${
                        imagePreview
                          ? "text-blue-500 bg-blue-50 dark:bg-blue-500/10 shadow-sm"
                          : "text-muted hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-500"
                      }`}
                      title="Adjuntar imagen"
                    >
                      <Paperclip
                        size={20}
                        className={`transition-transform duration-300 ${
                          imagePreview
                            ? "rotate-45"
                            : "group-hover:-rotate-12 group-hover:scale-110"
                        }`}
                      />

                      {imagePreview && (
                        <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-blue-500 border-2 border-surface rounded-full animate-pulse" />
                      )}
                    </button>

                    <button className="p-2.5 text-muted hover:bg-yellow-50 dark:hover:bg-yellow-500/10 hover:text-yellow-500 rounded-full transition-all duration-300 group active:scale-90">
                      <Smile
                        size={20}
                        className="group-hover:scale-110 transition-transform"
                      />
                    </button>
                  </div>

                  <button
                    onClick={handleSendComment}
                    disabled={!text.trim() && !imagePreview}
                    className="flex items-center gap-2 px-7 py-2.5 rounded-full font-bold bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-40 active:scale-95 shadow-md shadow-blue-500/20 transition-all"
                  >
                    <Send size={18} /> Comentar
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {comments.map((comment) => (
              <CommentCard
                key={comment.id}
                comment={comment}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
                onReply={handleReply}
                activeAction={activeAction}
                setActiveAction={setActiveAction}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Commentbox;
