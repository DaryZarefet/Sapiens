import { useAuthContext } from "@/context/AuthContext";
import { Profile } from "./Profile";

export const PageProfile = () => {
  const { user, isLoading } = useAuthContext();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin text-4xl">⏳</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-primary">Error al cargar el perfil</p>
      </div>
    );
  }

  return <Profile user={user} type={true} />;
};

export default PageProfile;
