import React, { useState, useEffect } from "react";
import { useIsDesktop } from "@/shared/ui/useIsDesktop";
import { Paperclip, Smile, Send } from "lucide-react";
import { PostCard } from "../Cards/PostCard";
import { CommentCard } from "../Cards/CommentCard";
import { exampleComments } from "@/mock/mockcomments";
import { Avatar } from "../Avatar";
import { useAuthContext } from "@/context/AuthContext";
import { commentService } from "@/services/commentService";
import type { Comment, ActiveAction, Post } from "@/types/types";

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
  const [comments, setComments] = useState<Comment[]>(() => {
    const saved = localStorage.getItem("local_comments");
    return saved ? JSON.parse(saved) : exampleComments;
  });
  const [text, setText] = useState("");
  const [activeAction, setActiveAction] = useState<ActiveAction>(null);

  useEffect(() => {
    localStorage.setItem("local_comments", JSON.stringify(comments));
  }, [comments]);

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

  const handleUpdate = (id: number, content: string) => {
    const updateRecursive = (list: Comment[]): Comment[] =>
      list.map((c) =>
        c.id === id
          ? { ...c, content }
          : { ...c, replies: c.replies ? updateRecursive(c.replies) : [] }
      );
    setComments(updateRecursive(comments));
    setActiveAction(null);
  };

  const handleReply = (parentId: number, replyText: string) => {
    if (!user) return;
    const newReply = commentService.createComment(replyText, user);
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
        <PostCard post={post} />

        <div className="mt-10">
          <h3 className="text-xl font-bold mb-6 text-primary">Comentarios</h3>

          <div
            className={`mb-8 p-5 bg-surface rounded-2xl shadow-sm ${
              activeAction ? "opacity-50 pointer-events-none" : ""
            }`}
          >
            <div className="flex items-start gap-4">
              <Avatar user={user} size={10} />
              <div className="flex-1">
                {/* ✅ Contenedor con línea inferior y textarea sin bordes ni paddings extra */}
                <div className="border-b border-default focus-within:border-blue-500 transition-colors">
                  <textarea
                    rows={1}
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Escribe tu comentario..."
                    className="w-full bg-transparent border-none outline-none ring-0 focus:ring-0 p-0 pb-2 text-primary placeholder:text-muted/50 resize-none text-base appearance-none"
                  />
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex gap-2 text-muted">
                    <button className="p-2 hover:bg-surface-2 rounded-full">
                      <Paperclip size={20} />
                    </button>
                    <button className="p-2 hover:bg-surface-2 rounded-full">
                      <Smile size={20} />
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      if (!text.trim() || !user) return;
                      setComments([
                        commentService.createComment(text, user),
                        ...comments,
                      ]);
                      setText("");
                    }}
                    disabled={!text.trim()}
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
