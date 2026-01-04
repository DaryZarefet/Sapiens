import { userlist } from "@/mock/mockusers";
import { Profile } from "./Profile";

const OtherProfile = () => {
  const user = userlist[0];

  return <Profile user={user} type={false} />;
};

export default OtherProfile;
