import React, { useState, useEffect } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { Camera } from "lucide-react";
import defaultAvatar from "@/assets/images/avatar.png";
import { userService } from "@/services/userService";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const EditProfile: React.FC = () => {
  const { user, verifyUser } = useAuthContext();
  const navigate = useNavigate();

  // Estados del formulario
  const [name, setName] = useState(""); // Nombre de usuario (username real)
  const [alias, setAlias] = useState("");
  const [about, setAbout] = useState("");
  const [dob, setDob] = useState("");
  const [sex, setSex] = useState("M"); // Default conforme al backend (M/F)

  // Estado para la imagen
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  useEffect(() => {
    if (user) {
      // "Nombre de Usuario" usually maps to username in this app's context
      // User says "defaults to user but changes to user's name".
      // We will ensure we use the identifier they log in with or the unique handle.
      setName(user.username || user.name || "");
      setAlias(user.alias || "");
      setAbout(user.note || "");
      // user.background, user.sex, etc. si existieran en el tipo
      if (user.avatar) {
        setAvatarPreview(user.avatar);
      }
    }
  }, [user]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("El archivo debe ser una imagen");
        return;
      }
      setAvatarFile(file); // Guardamos el archivo para enviarlo
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      toast.loading("Guardando cambios...", { id: "save-profile" });

      console.log(
        "[EditProfile] Guardando con alias:",
        alias,
        "Longitud:",
        alias.length
      );
      console.log(
        "[EditProfile] Avatar file:",
        avatarFile,
        "Tipo:",
        avatarFile?.type,
        "Tamaño:",
        avatarFile?.size
      );

      await userService.updateProfile({
        alias,
        username: name,
        about: about,
        sex: sex,
        birth_date: dob,
        avatar: avatarFile || undefined,
      });

      // Recargamos el usuario en el contexto
      await verifyUser();
      toast.success("Perfil actualizado correctamente", { id: "save-profile" });
      navigate("/perfil"); // Redirigir al perfil al guardar
    } catch (error) {
      console.error("[EditProfile] Error al guardar:", error);
      if (error instanceof Error) {
        console.error("[EditProfile] Error message:", error.message);
      }
      toast.error("Error al actualizar el perfil", { id: "save-profile" });
    }
  };

  const handleCancel = () => {
    toast.info("Cambios descartados");
    navigate("/perfil");
  };

  // Previsualización HEADER:
  // Si hay alias, mostramos alias. Si no, nombre. Si no, "Usuario".
  const displayHeaderName = alias || name || "Usuario";
  const displayAvatar = avatarPreview || defaultAvatar;

  return (
    <main className="flex-1 flex items-start justify-center py-8 px-4 sm:px-6 lg:px-12 bg-surface text-primary">
      <section className="w-full max-w-3xl">
        <div className="bg-surface-2 border-default rounded-2xl shadow-md p-6 sm:p-8 flex flex-col gap-6">
          {/* Header */}
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={displayAvatar}
                alt="Avatar Preview"
                className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover border-2 border-[var(--color-surface)] shadow-lg"
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = defaultAvatar;
                }}
              />

              <label
                htmlFor="avatar-upload"
                className="absolute right-0 bottom-0 transform translate-x-2 translate-y-2 bg-white border border-[var(--color-border)] rounded-full p-2 shadow-sm cursor-pointer hover:bg-surface-2 transition-colors"
                title="Cambiar avatar"
              >
                <Camera size={18} className="text-primary" />
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handleFileChange}
                />
              </label>
            </div>

            <div>
              <h1 className="text-xl md:text-2xl font-semibold text-primary">
                {displayHeaderName}
              </h1>
              <p className="text-sm text-muted mt-1">
                {user?.email ?? "email@ejemplo.com"}
              </p>
            </div>
          </div>

          {/* Form body */}
          <form
            className="flex flex-col gap-4"
            onSubmit={(e) => e.preventDefault()}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="username"
                  className="text-sm font-medium text-primary"
                >
                  Nombre de usuario
                </label>
                <input
                  id="username"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nombre de usuario"
                  className="w-full p-3 rounded-md bg-surface border border-[var(--color-border)] text-primary placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="alias"
                  className="text-sm font-medium text-primary"
                >
                  Alias
                </label>
                <input
                  id="alias"
                  type="text"
                  value={alias}
                  onChange={(e) => setAlias(e.target.value)}
                  placeholder="Alias (se mostrará en tu perfil)"
                  className="w-full p-3 rounded-md bg-surface border border-[var(--color-border)] text-primary placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="dob"
                  className="text-sm font-medium text-primary"
                >
                  Fecha de nacimiento
                </label>
                <input
                  id="dob"
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full p-3 rounded-md bg-surface border border-[var(--color-border)] text-primary placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="gender"
                  className="text-sm font-medium text-primary"
                >
                  Sexo
                </label>
                <select
                  id="gender"
                  value={sex}
                  onChange={(e) => setSex(e.target.value)}
                  className="w-full p-3 rounded-md bg-surface border border-[var(--color-border)] text-primary placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="M">Masculino</option>
                  <option value="F">Femenino</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="about"
                className="text-sm font-medium text-primary"
              >
                Sobre ti
              </label>
              <textarea
                id="about"
                rows={4}
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="Cuenta algo sobre ti..."
                className="w-full p-3 rounded-md bg-surface border border-[var(--color-border)] text-primary placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
                maxLength={300}
              />
              <div className="flex justify-between text-xs text-muted mt-1">
                <span>{about.length}/300</span>
                <span>Máx. 300 caracteres.</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-4 pt-2">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 rounded-lg border border-[var(--color-border)] text-primary bg-surface hover:bg-surface-2 transition-colors"
                >
                  Cancelar
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors shadow-sm font-medium"
                >
                  Guardar
                </button>
              </div>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
};

export default EditProfile;
