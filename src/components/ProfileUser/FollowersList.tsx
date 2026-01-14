import { ListUser } from "./ListUser";
import { useFollowStore } from "@/mock/useFollowStore";

const FollowersList = () => {
  const followers = useFollowStore((s) => s.followers);

  return (
    <div className="flex flex-col">
      <ListUser listuser={followers} />
    </div>
  );
};

export default FollowersList;
