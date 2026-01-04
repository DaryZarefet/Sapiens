import { ListUser } from "./ListUser";
import { userlist } from "@/mock/mockusers";

const FollowingList = () => {
  return (
    <div className="flex flex-col">
      <ListUser listuser={userlist} />
    </div>
  );
};

export default FollowingList;
