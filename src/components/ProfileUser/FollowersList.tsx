import { ListUser } from "./ListUser";
import { userlist } from "@/mock/mockusers";

const FollowersList = () => {
  return (
    <div className="flex flex-col">
      <ListUser listuser={userlist} />
    </div>
  );
};

export default FollowersList;
