import { ListUser } from "./ListUser";
import { useFollowStore } from "@/mock/useFollowStore";

const FollowingList = () => {
  const following = useFollowStore((s) => s.following);

  return (
    <div className="flex flex-col">
      <ListUser listuser={following} />
    </div>
  );
};

export default FollowingList;
