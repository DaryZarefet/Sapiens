import { useAuthContext } from "@/context/AuthContext";
import { Profile } from "./Profile";

export const PageProfile = () => {
  const { user } = useAuthContext();

  return <Profile user={user} type={true} />;
};

export default PageProfile;
