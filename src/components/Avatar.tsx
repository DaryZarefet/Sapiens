import avatardefault from "@/assets/images/avatar.png";

//TYPES
import type { User } from "@/types/types";

export const Avatar = ({ user, size = 10 }: { user: User; size?: number }) => {
  const { name, avatar } = user;

  return avatar ? (
    <img src={avatar} alt={name} className={`rounded-full object-cover w-${size} h-${size}`} />
  ) : (
    <div className={`rounded-full bg-gray-300 flex items-center justify-center font-semibold text-sm select-none w-10 h-10`} aria-hidden>
      <img src={avatardefault} alt={""} className={`rounded-full object-cover w-${size} h-${size}`} />
    </div>
  );
};
