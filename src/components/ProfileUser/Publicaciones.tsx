import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { usePostStore } from "@/mock/usePostStore";
import { useAuthContext } from "@/context/AuthContext";
import { PostCard } from "@/components/Cards/PostCard";
import { examplePosts } from "@/mock/mockpublic";
import { ButtonAction } from "@/shared/ui/ButtonAction";
import type { Post } from "@/types/types";

const Publicaciones = () => {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  const allPosts = usePostStore((s) => s.posts);
  const createPost = usePostStore((s) => s.createPost);
  const updatePost = usePostStore((s) => s.updatePost);
  const deletePost = usePostStore((s) => s.deletePost);

  const ownPosts = allPosts.filter((p) => p.user?.id === user?.id);
  const [posts, setPosts] = useState<Post[]>(ownPosts);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [showEdit, setShowEdit] = useState(false);

  useEffect(() => {
    setPosts(allPosts.filter((p) => p.user?.id === user?.id));
  }, [allPosts, user?.id]);

  const infonavs = [
    { name: "Publicaciones", path: "/perfil/publicaciones" },
    { name: "Comentarios", path: "/perfil/comentarios" },
    { name: "Guardados", path: "/perfil/guardados" },
    { name: "Me gusta", path: "/perfil/me-gusta" },
  ];

  return (
    <div className="bg-surface min-h-screen w-full text-center">
      <div className="max-w-6xl mx-auto p-4">
        <div className="flex justify-center">
          <div className="w-full max-w-3xl">
            <h2 className="text-xl font-semibold mb-4">Publicaciones</h2>
            {posts && posts.length > 0 ? (
              <div className="bg-surface-2 rounded-2xl border-default">
                {posts.map((p, idx) => (
                  <div key={p.id}>
                    <PostCard
                      post={
                        idx === 0
                          ? {
                              ...p,
                              user: { ...p.user, name: "Dario Martinez" },
                            }
                          : p
                      }
                      onDelete={(id: number) => deletePost(id)}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted">No hay publicaciones aún.</p>
            )}
          </div>
        </div>

        {showEdit && editingPost && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="w-full max-w-2xl bg-surface rounded-lg p-6 border-default">
              <h3 className="font-bold text-lg mb-4">Editar publicación</h3>

              <div className="flex flex-col gap-3">
                <input
                  value={editingPost.title}
                  onChange={(e) =>
                    setEditingPost({ ...editingPost, title: e.target.value })
                  }
                  className="p-2 border border-[var(--color-border)] rounded"
                />

                <textarea
                  value={editingPost.description}
                  onChange={(e) =>
                    setEditingPost({
                      ...editingPost,
                      description: e.target.value,
                    })
                  }
                  className="p-2 border border-[var(--color-border)] rounded min-h-[120px]"
                />

                <input
                  value={(editingPost.categories ?? []).join(", ")}
                  onChange={(e) =>
                    setEditingPost({
                      ...editingPost,
                      categories: e.target.value
                        .split(",")
                        .map((s) => s.trim()),
                    })
                  }
                  className="p-2 border border-[var(--color-border)] rounded"
                />

                <div className="flex justify-end gap-2 mt-3">
                  <ButtonAction
                    type="button"
                    className="px-4 py-2"
                    onClick={() => setShowEdit(false)}>
                    Cancelar
                  </ButtonAction>

                  <ButtonAction
                    type="button"
                    className="px-4 py-2"
                    onClick={() => {
                      if (!editingPost) return;
                      setPosts((prev) =>
                        prev.map((p) =>
                          p.id === editingPost.id ? editingPost : p
                        )
                      );
                      setShowEdit(false);
                      setSelectedPost(editingPost);
                    }}>
                    Guardar
                  </ButtonAction>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Publicaciones;
