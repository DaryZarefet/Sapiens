// ICONS
import { ButtonAction } from "@/shared/ui/ButtonAction";
import { Paperclip } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { usePostStore } from "@/mock/usePostStore";
import { useAuthContext } from "@/context/AuthContext";
import type { Post } from "@/types/types";

const CreateArticle = ({ document }: { document: boolean }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const editingPost = (location.state as any)?.post as Post | undefined;

  const createPost = usePostStore((s) => s.createPost);
  const updatePost = usePostStore((s) => s.updatePost);
  const { user } = useAuthContext();

  const [title, setTitle] = useState(editingPost?.title ?? "");
  const [typeInput, setTypeInput] = useState(editingPost?.type ?? "");
  const [categoriesInput, setCategoriesInput] = useState(
    (editingPost?.categories ?? []).join(", ") ?? ""
  );
  const [body, setBody] = useState(editingPost?.description ?? "");

  useEffect(() => {
    if (editingPost) {
      setTitle(editingPost.title ?? "");
      setTypeInput(editingPost.type ?? "");
      setCategoriesInput((editingPost.categories ?? []).join(", ") ?? "");
      setBody(editingPost.description ?? "");
    }
  }, [editingPost]);

  const handleSave = () => {
    if (editingPost) {
      const updated: Post = {
        ...editingPost,
        title,
        type: typeInput,
        categories: categoriesInput
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        description: body,
      };

      // Actualizar en el store y volver a inicio
      updatePost(editingPost.id, updated);
      navigate("/inicio");
      return;
    }

    // Crear nueva publicación en el store y volver a publicaciones
    const newPost = createPost({
      title,
      description: body,
      categories: categoriesInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      user: user,
      institution: "",
      type: typeInput,
    });

    navigate("/inicio");
  };

  return (
    <div className="flex items-center justify-center px-5 lg:px-10 xl:px-20 w-full">
      <div className="w-full my-5 mx-5 lg:mx-10 xl:mx-20 p-8 bg-surface rounded-2xl border-default shadow-md">
        <div className="flex flex-col gap-4">
          <div className="border-b border-[var(--color-border)] pb-4 font-semibold">
            {editingPost
              ? "Editar publicación"
              : document
              ? "Publicar documento"
              : "Publicar mensaje"}
          </div>

          {/* Archive */}
          {document && (
            <>
              <div className="font-semibold">Archivo</div>
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <label
                    htmlFor="attachment-upload"
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-surface-2 border border-[var(--color-border)] text-primary cursor-pointer hover:bg-surface transition"
                    title="Añadir archivo adjunto">
                    <Paperclip size={18} className="text-primary" />
                    <span className="text-sm font-semibold">
                      Añadir archivo
                    </span>
                    <input
                      id="attachment-upload"
                      type="file"
                      className="sr-only"
                    />
                  </label>
                </div>
              </div>
            </>
          )}

          {/* Title */}
          {document && (
            <div className="relative">
              <input
                type="text"
                placeholder="Introduce un título (obligatorio)"
                className="p-3 w-full text-md font-semibold border border-[var(--color-border)] rounded-lg text-primary"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <div className="absolute bottom-4 right-4 flex items-center justify-end">
                <span id="title-counter" className="text-xs text-muted">
                  {title.length}/200
                </span>
              </div>
            </div>
          )}

          {/* Type + Category row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Tipo de publicación"
              className="p-3 w-full text-md font-semibold border border-[var(--color-border)] rounded-lg text-primary"
              value={typeInput}
              onChange={(e) => setTypeInput(e.target.value)}
            />

            <input
              type="text"
              placeholder="Categoría"
              className="p-3 w-full text-md font-semibold border border-[var(--color-border)] rounded-lg text-primary"
              value={categoriesInput}
              onChange={(e) => setCategoriesInput(e.target.value)}
            />
          </div>

          {/* Body */}
          <div className="mb-6">
            <label htmlFor="bodyInput" className="sr-only">
              Contenido
            </label>
            <div className="border-default rounded-md p-4 bg-surface-2">
              <textarea
                id="bodyInput"
                placeholder="Introduce el contenido de la publicación"
                className="w-full min-h-[300px] text-md text-primary outline-none resize-vertical font-semibold"
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
            </div>
          </div>

          {/* Footer actions */}
          <div className="flex items-center justify-between gap-4">
            <div className="w-10" />

            <div className="flex items-center gap-3">
              <ButtonAction
                type="button"
                className="px-4 py-2 rounded-md border border-[var(--color-border)] bg-surface text-primary hover:bg-surface-2 transition"
                onClick={() => navigate(-1)}>
                Cancelar
              </ButtonAction>

              <ButtonAction
                type="button"
                className="inline-flex items-center gap-2 px-4 py-2 btn-primary"
                onClick={handleSave}>
                <span>{editingPost ? "Listo" : "Publicar"}</span>
              </ButtonAction>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateArticle;
